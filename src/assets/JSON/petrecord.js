export const petRecord = [{
    "Water" : {
        "id":0,
         "icon":"water.png",
         "unit":"Water",
        "isSelected": false,
        "query" : "Did you top up pet's water?",
        "timePicker": true,
        "isCart":false,
        "checkboxVisible":true
    },"Food":{
        "id":1,
        "icon":"food.png",
        "unit":"Food",
        "isSelected": false,
        "query" : "Did you top up pet's food?",
        "isCart":false,
        "timePicker": true,
        "checkboxVisible":true
    },"Medication":{
        "id":2,
        "icon":"medication.png",
        "unit":"Medication",
        "isSelected": false,
        "query" : "Did you give medication?",
         "timePicker": true
    },"Poo":{
        "id":3,
        "icon":"poo.png",
        "unit":"Poo",
        "isSelected": false,
        "query" : "Anything to note about pet's poo?",
        "toggle":false,
        "checkboxVisible":true
    },"Wee":{
        "id":4,
        "icon":"wee.png",
        "unit":"Wee",
        "isSelected": false,
        "query" : "Did they wee?",
        "toggle":false,
        "checkboxVisible":true
    },"Property Secured":{
        "id":5,
        "icon":"home.png",
        "unit":"Property Secured",
        "isSelected": false,
        "query" : "Did you lock up after you left?",
        "toggle":true
    },"Duration":{
        "id":7,
        "icon":"walk.png",
        "unit":"Duration",
        "isSelected": false,
        "query" : "How long did you walk for?",
        "timePicker": true,
        "isChips":true,
        "chips" : [{
            "duration":"30 min",
            "isSelected": false
        },{
            "duration":"45 min",
            "isSelected": false
        },{
            "duration": "1 hour",
            "isSelected": false
        }]
    },"Mood":{
        "id": 8, 
        "icon":"mood.png",
        "unit":"Mood",
        "isSelected": false,
        "query" : "How was pet mood?",
        "isIcons":true,
        "iconName":[
            {
                "name":"Anxious",
                "icons":"anxious.png",
                "isSelected":false
            },{
                "name":"Cheeky",
                "icons":"cheeky.png",
                "isSelected":false
            },{
                "name":"Cuddly",
                "icons":"cuddly.png",
                "isSelected":false
            },{
                "name":"Happy",
                "icons":"mood.png",
                "isSelected":false
            },{
                "name":"Naughty",
                "icons":"naughty.png",
                "isSelected":false
            },{
                "name":"Noisy",
                "icons":"noisy.png",
                "isSelected":false
            },{
                "name":"Sleepy",
                "icons":"sleepy.png",
                "isSelected":false
            }]
    },"Special Care":{
        "id": 9,
        "checkboxVisible":true,
        "icon":"specialcare.png",
        "unit":"Special Care",
        "query":"Any special care?",
        "timePicker":true
    }
}]



