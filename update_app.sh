#!/bin/bash

if [ -d "client/build" ] && [ -d "server/app" ]
then
    rm -r server/app/*

    cp -r client/build/* server/app/
fi
