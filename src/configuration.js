const Configuration = {
    baseURL: "http://localhost:8080/",
    apiUrl: "https://laughing-carson-296cd4.netlify.com/api",
    provisionURL: "http://192.168.4.1",
    mdashURL: "https://mdash.net",
    appID: "", // <-- Set this to YOUR_APP_ID
    callTimeoutMilli: 10000, // 10 seconds
    defaultSiteName: "NewSite",
    drinkSizes: {
        "1000": "Liter (1000 mL)",
        "500": "Half Liter (500 mL)",
        "651": "Bomber (651 mL)",
        "568": "UK Pint (568 mL)",
        "473": "US Pint (473 mL)",
        "355": "US Bottle (355 mL)",
        "0": "Custom"
    },
    drinkSizes_US: {
        "1000": "Liter (33.8oz)",
        "500": "Half Liter (16.9 oz)",
        "651": "Bomber (22.0 oz)",
        "568": "UK Pint (19.2 oz)",
        "473": "US Pint (16 oz)",
        "355": "US Bottle (12 oz)",
        "0": "Custom"
    },
    kegSizes: {
        "9464": "Half Corny (9.5L)",
        "18927": "Corny (18.9L)",
        "19550": "1/6 Barrel (19.6L)",
        "20000": "20L",
        "25000": "25L",
        "29340": "1/4 Barrel (29.3L)",
        "30000": "30L",
        "40915": "Firkin (40.9L)",
        "50000": "50L",
        "58670": "1/2 Barrel (58.7L)",
        "0": "Custom"
    },
    kegSizes_US: {
        "9464": "Half Corny (2.5 gal)",
        "18927": "Corny (5 gal)",
        "19550": "1/6 Barrel (5.16 gal)",
        "20000": "20L (5.28 gal)",
        "25000": "25L (6.6 gal)",
        "29340": "1/4 Barrel (7.75 gal)",
        "30000": "30L (7.93 gal)",
        "40915": "Firkin (10.81 gal)",
        "50000": "50L (13.21 gal)",
        "58670": "1/2 Barrel (15.5 gal)",
        "0": "Custom"
    }
}

export default Configuration;