#! /bin/bash

if [ $1 = "start" ]; then 
	echo "> start fn"
	fn start --log-level DEBUG
fi

if [ $1 = "tx-deploy" ]; then
	echo "> start transactions fn app";
	cd transactions
	fn --verbose deploy --app transactions --local
	fn inspect function transactions transactions
	cd ../
fi

if [ $1 = "tx-test" ]; then
	echo "> start transactions app test";
	cd transactions
	npx tsc
	fn --verbose deploy --app transactions --local
	fn inspect function transactions transactions
	curl --location 'http://localhost:8080/invoke/01H24ZQ67XNG8G00RZJ0000002' --header 'Content-Type: application/json' --data '{"amount": 10,"message": "test","networkType": 104,"recipientAddress": "TA2UYSGSJT6QQA2AS44RF4NFYI7XA7YQSJQW5RY"}'
	cd ../
fi

if [ $1 = "list" ]; then 
	echo "> get fn app list"
	fn list apps
fi