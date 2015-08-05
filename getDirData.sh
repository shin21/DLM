#!/usr/bin/env sh

echo loading ./photo/ . . .

file=./js/dirData.js
echo dirData = [ > $file

d=`find ./photo/ -type d`
for i in $d
do
    echo $i | grep -qE "/$"
    # if the end of string is "/"
    if [ $? -eq 0 ]
    then
        l=$((${#i}-1))
        substr=`echo $i | cut -c 1-$l`
        echo \"$substr\", >> $file
    else
       echo \"$i\", >> $file
    fi
done

f=`find ./photo/ -type f`
for i in $f
do
    echo \"$i\", >> $file
done

echo ]\; >> $file

echo complete!
