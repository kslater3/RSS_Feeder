#!/bin/bash

if [ -d "client/dist/client" ] && [ -d "server/app" ]
then
    rm -r server/app/*
    cp -r client/dist/client/* server/app/
fi
