chcp 65001
@echo off
echo load dir . . .

echo dirData = [ > ./js/dirData.js
echo "./photo", >> ./js/dirData.js
for /f "delims=" %%i in ('dir /B /S /O:N .\photo') do (
	setlocal enabledelayedexpansion
	set string=%%~pnxi
	set new_string=!string:\=/!
	echo "!new_string!", >> ./js/dirData.js
)
echo ]; >> ./js/dirData.js

echo complete!
pause
