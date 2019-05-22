function toUpperCase() {
  echo $1 | awk '{print toupper($0)}'
}

#read env, read port
env=$1

usage='bash start.sh env'
if ! [ ${env} ]; then
    echo ${usage}
    exit
fi

BIG_ENV=$(toUpperCase $env)

PORT_KEY=$BIG_ENV'_ADMIN_FE_PORT'
port=$(eval echo "$"$PORT_KEY)
if [[ -z $port ]]; then
    echo 'please set env '$PORT_KEY
    exit 1
fi

HOST_KEY=$BIG_ENV'_ADMIN_FE_API_HOST'
host=$(eval echo "$"$HOST_KEY)
if [[ -z $host ]]; then
    echo 'please set env '$HOST_KEY
    exit 1
fi

registerUrlKey=$BIG_ENV'_REGISTER_URL'
registerUrl=$(eval echo "$"$registerUrlKey)
if [[ -z $registerUrl ]]; then
    echo 'please set env '$registerUrlKey
    exit 1
fi

echo "VUE_APP_HOST=${host}" > .env
echo "VUE_APP_REGISTER_URL=${registerUrl}" >> .env

image=youxiangju-admin-fe

docker build . -t $image

container=$env.$image

docker stop $container
docker rm $container

rm .env

docker run --name $container \
-d \
-p ${port}:80 \
$image
