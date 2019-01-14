# node-cron-job-api

## the following code facilitates a cron job to hit an external api after defined intervals to fetch latest data and generate csv file for that data. 

## There will be a new csv file generated each time the cronjob fetched latest data to contain that latest data. 

## there will be a master csv file whcih will contain all the records with latest values. Means the new records will be appended to exisiting records list and update the values of existing data is any change is there.

# run following commands in same order.

1. npm install
2. npm start

## once the cron job starts, it will keep on fetching the data from the api url after every 30 mins and write the data into the csv files. these csv files will get stored in the same driectory as this solution resides
