const crypto = require('crypto-js')
const fs = require('fs')
const File = require('../models/File')
const Access = require('../models/Access')
const Share = require('../models/Share')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try{
        const  access = await Access.find({userId: req.user.id})
        const fileid = access.map(function (access) {
            return access['fileId']
        })
        const files = await File.find().where('_id').in(fileid);
        return res.status(200).json(files)
    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.getById = async function (req, res) {
    try{
        const  access = await Access.findOne({userId: req.user.id, fileId: req.params.fileid})
        if(access){
            const  file = await File.findOne({_id: access.fileId})
            if(file){
                return res.status(200).json(file)
            }else {
                return res.status(404).json({
                    message:'Файл не найден.'
                })
            }
        }else{
            return res.status(409).json({
                message: 'Ошибка доступа.'
            })
        }
    }catch (e) {
        errorHandler(res.e)
    }
}

module.exports.remove = async function (req, res) {
    try{
        const file = await File.findOne({ownerId: req.user.id, _id: req.params.fileid})//проверка на владельца
        const access = await Access.findOne({userId: req.user.id, FileId: req.params.fileid})//имеет ли доступ юзер в таблице доступа
        if(file && access){
            await Share.deleteMany({accessLink:access._id})
            await Access.deleteMany({fileId: access.fileId})
            await File.deleteOne({_id:access.fileId})
            await fs.unlink(file.fileSrc, (err) => {
                if (err) {
                    res.status(409).json(err)
                }
            })
            return res.status(200).json({
                message:'Файл удален.'
            })
        }
        else{
            return res.status(409).json({
                message: 'Ошибка доступа.'
            })
        }
    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.create = async function (req, res) {
    if(req.file.mimetype === 'text/plain'){
        let file;
        try{
            file = await new File({
                name: req.body.name || `file_${+(new Date())}`,
                fileSrc: req.file.path,
                ownerId:req.user.id
            })
            await file.save()
        }catch (e) {
            errorHandler(res,e)
        }

        const candidateFile = await File.findOne({fileSrc: req.file.path})
        const access = new Access({
            userId: req.user.id,
            fileId: candidateFile._id
        })
        try{
            await access.save()
            return res.status(200).json(file._id)
        }catch (e) {
            errorHandler(res,e)
        }
    }
    else{
        await fs.unlink(req.file.path,(err) => {
            if (err) {
                res.status(409).json(err)
            }
        })
        return res.status(406).json({
            message: 'Сервис поддерживает только текстовый формат файлов.'
        })
    }

}

module.exports.download = async function (req, res){
    try {
        const access = await Access.findOne({userId: req.user.id, fileId: req.params.fileid})
        const file = await File.findOne({_id: access.fileId})
        if(file || access)
        {
            try {
                return await res.download(file.fileSrc)
            }catch (e) {
                errorHandler(res,e)
            }
        } else {
            res.status(404).json({message:'Файл не найден'})
        }
    }
    catch (e) {
        errorHandler(res,e)
    }
}

module.exports.createShare = async function (req, res) {
    try{
        const file = await File.findOne({ownerId: req.user.id, _id: req.params.fileid})//ищется файл, по юзер айди сессии, и айди файла, проверяем на владельца
        const access = await Access.findOne({userId: req.user.id, fileId: req.params.fileid})//ищем чтобы вписать в share ссылку на него
        if(file && access){                                                   //если только проверка аксес, все могли бы делиться файлом,
            const share = new Share({
                shareHash: crypto.SHA256(file.fileSrc),
                accessLink: access._id
            })
            await share.save()
            return res.status(200).json(share.shareHash)
        }else {
            return res.status(404).json({
                message: 'Файл не найден'
            })
        }
    }
    catch (e) {
        errorHandler(res,e)
    }
}

module.exports.addAccess = async function (req, res) {
    try{
        const share = await Share.findOne({shareHash: req.params.sharehash})
        if(share){
            const ownAccess = await Access.findById(share.accessLink)
            if(req.user.id == ownAccess.userId) {
                return res.status(200).json({message: 'У вас уже есть доступ к этому файлу'})//у пользователя уже есть доступ, нет смысла создавать еще один доступ
            }
            const guestAccess = await Access.findOne({userId:req.user.id, fileId:ownAccess.fileId})
            if(guestAccess){
                if(req.user.id == guestAccess.userId) {
                    return res.status(200).json({message: 'У вас уже есть доступ к этому файлу'})//у пользователя уже есть доступ, нет смысла создавать еще один доступ
                }
            }
           else{
                const newAccess = new Access({
                    userId: req.user.id,
                    fileId: ownAccess.fileId
                })
                await newAccess.save()
                return res.status(201).json({message: 'Доступ получен'})
            }
        }else {
            return res.status(400).json({
                message: 'Bad Request'
            })
        }

    }catch (e) {
        errorHandler(res,e)
    }
}

module.exports.removeAccess = async function (req, res) {
//проверка на владельца, нахождение shareHash, его удалениеЮ если он есть, после удаление записей Access всех, кроме записи access.userId==file.owner.id
    try{
        const file = await File.findOne({ownerId: req.user.id, _id: req.params.fileid})//ищется файл, по юзер айди сессии, и айди файла, проверяем на владельца
        const ownerAccess = await Access.findOne({userId: req.user.id, fileId: req.params.fileid})
        if(file && ownerAccess){
            const share = await Share.find({accessLink: ownerAccess._id})
            if(share){
                await Share.deleteMany({accessLink: ownerAccess._id})
            }
            await Access.deleteMany({fileId: file._id})
            const newOwnerAccess = await  new Access({
                userId: ownerAccess.userId,
                fileId: ownerAccess.fileId
            }).save()
            return res.status(200).json({
                message:'Доступ удален.'
            })
        }else{
            return res.status(403).json({
                message: 'Ошибка доступа'
            })
        }
    }catch (e) {
        errorHandler(res,e)
    }

}