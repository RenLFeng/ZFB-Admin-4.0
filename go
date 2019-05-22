#read env, read port
env=$1

usage='bash start.sh env'
if ! [ ${env} ]; then
	echo ${usage}
	exit
fi

if [[ -z ${ADMIN_FE_API_HOST} ]]; then
	echo "please set env var ADMIN_FE_API_HOST"
	exit 1
fi

if [[ -z ${REGISTER_URL} ]]; then
	echo 'please set env var REGISTER_URL'
	exit 1
fi

host=http://${env}-${ADMIN_FE_API_HOST}
registerUrl=http://${env}-${REGISTER_URL}

echo "VUE_APP_HOST=${host}" >.env
echo "VUE_APP_REGISTER_URL=${registerUrl}" >>.env

cat .env

image=pospay-admin-fe
container=$env-$image

docker build . -t $image

docker stop $container
docker rm $container

rm .env

docker run \
	--name $container \
	--network inner \
	-d \
	$image
