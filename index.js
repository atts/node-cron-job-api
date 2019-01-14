
const https = require('https');
const json2csv = require('json2csv').Parser;
const cron = require('node-cron');
const fs = require('fs');
const fields = ['ID', 'post_name', 'permalink', 'category', 'read_count']; // field/attributes in the json data
const opts = { fields };
const parser = new json2csv(opts);

let localFeedData = [];

function generateCSVData(){
    https.get('<api url>', (data) => {  // put the api url here.
        let jsonData = '';
        data.on('data', (chunk) => {
            //if the data is received in chunks from api
            jsonData += chunk;
        });
        data.on('end', () => {
            // data is received completely from api
            let json = JSON.parse(jsonData); 
            let apiFeedData = json.cards;  
            if(!localFeedData){
                // will stored the api data received for first time
                localFeedData=apiFeedData;
                console.log(localFeedData);
            }
            else{
                var datetime = new Date();
                var arr = datetime.toString().split(' ');
                var timearr = arr[4].split(':'); 
                // please note : is replaced by / in mac so I am using - instead of :
                var timeStamp = timearr[0] + "-"+timearr[1];
                console.log(timeStamp);
                let fileName = 'csv_' + timeStamp + '_' + arr[2] + '_' + arr[1] + '_' + arr[3] + '.csv'; // file name format with the time stamp
                let csv = parser.parse(apiFeedData);      
                fs.writeFile(fileName, csv, function(err) {
                    // will write all the data to csv.csv file and store file in the same folder as that of this project
                    if (err) throw err;
                    console.log('file saved');
                });  
                for(var i=0;i<apiFeedData.length;i++){
                    if (localFeedData.filter(function(e) { return e.ID === apiFeedData[i].ID; }).length == 0) {
                        // storing new data from api
                        localFeedData.push(apiFeedData[i]);
                      }
                      else{
                        for(var j=0;j<localFeedData.length;j++){
                            //if data already exists, update the read count
                            if(localFeedData[j].ID==apiFeedData[i].ID){
                                localFeedData[j].read_count = apiFeedData[i].read_count
                            }
                        }
                      }
                }
            }
            // to kepp the latest added data at top
            localFeedData.reverse();
            let masterCsv = parser.parse(localFeedData);      
            fs.writeFile('master.csv', masterCsv, function(err) {
                // will write all the data to sk_master.csv file and store file in the same folder as that of this project
                if (err) throw err;
                console.log('master file saved');
            });          
        });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
}

// this format means the job will run after every 30 mins
cron.schedule('*/30 * * * *', function(){
    generateCSVData();
});
