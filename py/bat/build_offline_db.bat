:: - MEASURE DHS MOBILE DB BUILD SCRIPT
call syncdb.bat

:: - Add JSON files to Local Resource Table
cd\
cd .\javascript_working_directory\2265-mobile-measure-dhs\py
python manage.py load_json_files -f C:\javascript_working_directory\2265-mobile-measure-dhs\data

echo from time import sleep; sleep(30) | python


