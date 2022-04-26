res=$(curl -XPOST -H "Content-type: application/json" -d '{
    "email": "user@mail.ru",
    "password": "123123"
}' 'http://localhost:5000/api/auth/login')


ID=`echo $res | grep token | tr -d '"{}' | awk  '{print $2}'`


res=$(curl -F @file=@./vlad.txt -H "Authorization: Bearer $ID" 'http://localhost:5000/api/file')

FILEID=`echo $res | tr -d '"'`

res=$(curl -o ./file.txt -H "Authorization: Bearer $ID" "http://localhost:5000/api/file/get/${FILEID}")


