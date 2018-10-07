#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

printf "\nValidating with XML Lint:\n----------------------\n"
if xmllint $1 --noout ; then
    printf "${GREEN}No XML errors found.${NC}\n"
else
    printf "${RED}XML Document is not validating correctly.${NC}\n"
fi
printf "\nGenerating XML Report:\n----------------------\n"
node app $1
