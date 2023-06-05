#! /bin/bash

if [ $1 = "start" ]; then 
	echo "> start fn"
	fn start --log-level DEBUG
fi

if [ $1 = "transactions" ]; then
	echo "> start transactions fn app";
	cd transactions
	npx tsc
	fn --verbose deploy --app transactions --local
	fn inspect function transactions transactions
	cd ../
fi

if [ $1 = "transactions-test" ]; then
	echo "> start transactions app test";
	cd transactions
	echo -n {"name":"Bob"} | fn invoke transactions transactions --content-type application/json
	curl --location 'http://localhost:8080/invoke/01H24ZQ67XNG8G00RZJ0000002' --header 'Content-Type: application/json' --data '{"name": "bob"}'
	cd ../
fi

if [ $1 = "list" ]; then 
	echo "> get fn app list"
	fn list apps
fi