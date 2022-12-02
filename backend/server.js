const express = require('express')
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require('path');
const app = express()
const { getVideoDurationInSeconds } = require('get-video-duration');
const { getAudioDurationInSeconds } = require('get-audio-duration')

app.use(
    fileupload({
        createParentPath: true,
    }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const file_type_enum = {
    'png': 0,
    'jpeg': 0,
    'jpg': 0,
    'mp4': 1,
    'avi': 1,
    'mkv': 1,
    'txt': 2,
    'mp3': 3,
    'ogg': 3,
}

const type_to_thumbnail = [
    'assets/imageLogo.png',
    'assets/videoLogo.png',
    'assets/textLogo.png',
    'assets/audioLogo.png',
]

const mysql = require('mysql2');
const sha256 = require('js-sha256');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');

function makeid(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.post("/add_stimulus", async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: "failed",
                message: "No file uploaded",
            });
        } else {
            let file = req.files.file;
            const name = req.body.name
            const category = req.body.category

            // getting category id
            let query = `
                SELECT idCategory
                FROM category
                WHERE name = '${category}';
            `
            con.query(query, (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    const category_id = result[0]['idCategory']
                    
                    let file_name = file.name.split('.')
                    const file_ext = file_name.pop()
                    let file_id = file_name.join('').replaceAll(' ', '')
                    file_id.trim()
                    const filename_final = "./stimuli/" + file_id + makeid(5) + '.' + file_ext
                    file.mv(filename_final);
                    
                    query = `
                    INSERT INTO stimulus(name, category, type, file_name)
                    VALUES ('${name}', ${category_id}, ${file_type_enum[file_ext]}, '${filename_final}');
                    `
                    con.query(query, (err, result, fields) => {
                        if (err) throw err;
                        if (result.affectedRows === 1) {   
                            res.send({
                                status: "success",
                                message: "File is uploaded",
                                valid: true,
                                data: {
                                    name: file.name,
                                    mimetype: file.mimetype,
                                    size: file.size,
                                },
                            });
                        } else {
                            res.send({
                                status: "error",
                                valid: false,
                            })
                        }
                    })
                } else {
                    res.send({
                        status: 'error',
                        message: 'Category name not present',
                        valid: false,
                    })
                }
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
  }
);

var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",
  database: "emogamedb",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const applyMiddleware = (res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    return res
}

const evalRequest = (req, func) => {
    data=""
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', () => {
        data = JSON.parse(data)
        func(data)
    })
}

const logActivity = (activity) => {
    const dt = new Date();
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

    datetime = `${
        padL(dt.getMonth()+1)}/${
        padL(dt.getDate())}/${
        dt.getFullYear()} ${
        padL(dt.getHours())}:${
        padL(dt.getMinutes())}:${
        padL(dt.getSeconds())}`;

    console.log(`server (${datetime}) :: ${activity}`)
}


app.post('/is_stimulus_name_in_db', async (req, res) => {
    console.log('la richiesta')
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        let valid = false;
        const query = `
            SELECT * from stimulus 
            WHERE name = '${data.name}';
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            if (result.length === 0) valid = true;
            logActivity('controllo per aggiunta di uno stimolo ' + (valid ? ' riuscito' : ' fallito'))
            res.send({valid})
        })
    })
});

app.post("/check_register_therapist", (req, res) => {
    res = applyMiddleware(res)
    
    evalRequest(req, (data) => {
        let valid = false;
        const query = `
            SELECT * from therapist 
            WHERE email = '${data.email}';
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            if (result.length === 0) valid = true;
            logActivity('controllo per aggiunta di un terapista' + (valid ? ' riuscito' : ' fallito'))
            res.send({valid})
        })
    })
})

app.post("/register_therapist", (req, res) => {
    res = applyMiddleware(res)
    
    evalRequest(req, (data) => {
        let valid = false;
        const query = `
            SELECT * from therapist 
            WHERE email = '${data.email}';
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            const query = `
                INSERT INTO therapist(email, password)
                VALUES ('${data.email}', '${sha256(data.password)}');
            `
            if (result.length === 0) {
                con.query(query, (err, result, fields) => {
                    if (err) throw err;
                    if (result.affectedRows === 1) valid = true;
                    logActivity('tentativo di aggiunta di un terapista' + (valid ? ' riuscito' : ' fallito'))
                    res.send({valid})
                })
            } else {
                res.send({valid})
            }
        })
    })
})

app.post("/check_login", (req, res) => {
    res = applyMiddleware(res)

    evalRequest(req, (data) => {
        let valid = false;
        conv_password = sha256(data.password)
        con.query(`select * from therapist WHERE email = '${data.email}' AND password = '${conv_password}';`, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                if (result[0].email == data.email && 
                    result[0].password == conv_password) 
                    valid = true;
            }
            logActivity('tentativo di login come terapista' + (valid ? ' riuscito' : ' fallito'))
            res.send({valid})
          });
    })
})

app.get("/get_stimulus_categories", (req, res) => {
    res = applyMiddleware(res)
    let query = `
        SELECT name
        FROM category;
    `
    con.query(query, (err, result, fields) => {
        if (err) throw err;
        res.send({categories: result.map((obj) => obj.name)})
    })
})

/*
app.post("/add_stimulus", (req, res) => {
    res = applyMiddleware(res)

    evalRequest(req, (data) => {
        store_file(req);
        logActivity('tentativo di aggiungere un nuovo stimolo ' + (valid ? ' riuscito' : ' fallito'))
        res.send({valid})
    })
})
*/

app.post("/add_stimulus_category", (req, res) => {
    res = applyMiddleware(res)

    evalRequest(req, (data) => {
         let query = `
            SELECT * 
            FROM category
            WHERE name = '${data.newCat}';
        `
        con.query(query, (err, result, fields) => {
            console.log(result)
            if (result.length === 0) {
                query = `
                    INSERT INTO category(name)
                    VALUES ('${data.newCat}');
                `
                con.query(query, (err, result, fields) => {
                    if (err) throw err;
                    console.log(result)
                    const valid = result.affectedRows === 1;
                    logActivity('tentativo di aggiungere una nuova categoria di stimoli  ' + (valid ? ' riuscito' : ' fallito'))
                    res.send({valid})
                })
            } else {
                res.send({valid: false})
            }
        })
    })
})

app.get("/get_all_stimulus", (req, res) => {
    
    res = applyMiddleware(res)
    let query = `
        SELECT  category.name AS CategoryName, stimulus.name AS StimulusName, type, file_name AS FileName
        FROM stimulus INNER JOIN category
        ON stimulus.category = category.idCategory
        ORDER BY category.name, stimulus.idStimulus;
    `
    con.query(query, (err, result, fields) => { 
        if (err) throw err; 
        //console.log(result)
        let catStimObj = {}
        result.forEach(row => {
        if (row.CategoryName in catStimObj) {
            catStimObj[row.CategoryName].push({ "name": row.StimulusName, "thumbnail": type_to_thumbnail[row.type], "file": row.FileName })
        } else {
            catStimObj[row.CategoryName] = [{ "name": row.StimulusName, "thumbnail": type_to_thumbnail[row.type], "file": row.FileName }]
        }
        })

        //console.log(catStimObj)

        let stimulusList = []
        for (const cat in catStimObj) {
        stimulusList.push({
            category: cat,
            stimuli: catStimObj[cat],
        })
        }

        //console.log(stimulusList)
        res.send({
            valid:true,
            stimulusList,
        })
    })
})


app.post("/get_stimulus_file", (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        const fileName = data.fileName
        res.sendFile(fileName, {root: path.join(__dirname)}, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "internal server error. please try again later" });
            } else {
                console.log("Sent:", fileName, "at", new Date().toString());
            }
        });
    })
})

app.post("/get_stimulus_text", (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        const fileName = data.fileName
        const text = fs.readFileSync(fileName).toString()
        res.send({
            text
        })
    })
})

app.post("/is_gameName_already_present", (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        const gameName = data.gameName
        let valid = false
        let query = `
            SELECT * 
            FROM game
            WHERE name = '${gameName}';
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            if (result.length === 0) { valid = true; }
            logActivity('tentativo di aggiunta di un gioco  ' + (valid ? ' riuscito' : ' fallito'))
            res.send({ valid })
        })
    })
})

app.post("/add_update_game", (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        const gameName = data.gameName
        const rows = data.rows
        
        let valid = false
        let query = `
            SELECT * 
            FROM game
            WHERE name = '${gameName}';
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            query = 'select "query vuota";'
            if (result.length > 0) {
                query = `
                    DELETE FROM game
                    WHERE game.name = '${gameName}';
                `
            }
            console.log(query)
            con.query(query, (err, result, fields) => {
                if (err) throw err;
                
                query = `
                    INSERT INTO game(name)
                    VALUES ('${gameName}');
                `

                con.query(query, (err, result, fields) => {
                    if (err) throw err;
                    if (result.affectedRows !== 1) { 
                        console.log('aggiunta più o meno di un game')
                        res.send({valid: false, error: 'aggiunta più o meno di un game'}) 
                    }
                    else {
                        query = `
                            SELECT idGame
                            FROM game
                            WHERE name = '${gameName}';
                        `
                        con.query(query, (err, result, fields) => {
                            if (err) throw err;
                            if (result.length !== 1) {
                                console.log('esiste più di un game con lo stesso nome')
                                res.send({valid: false, error: 'esiste più di un game con lo stesso nome'})
                            }
                            else {
                                const gameId = result[0].idGame
                                console.log("idGame", result, gameId)
                                let ok = true;
                                for (let i = 0; i < rows.length; i++) {
                                    const row = rows[i];
                                    console.log(row)
                                    if (!ok) {
                                        const error = 'errore nell\'inserimento di uno stimolo nel gioco'
                                        console.log(error)
                                        res.send({valid: false, error})
                                        throw new Error(error)
                                    }
                                    const { duration, index  } = row
                                    const StimulusName = row.name
                                    query = `
                                        SELECT idStimulus
                                        FROM stimulus
                                        WHERE name = '${StimulusName}';
                                    `
                                    con.query(query, (err, result, fields) => {
                                        if (err) throw err;
                                        console.log(result)
                                        if (result.length === 0) {
                                            console.log('non esisto lo stimolo inserito ' + StimulusName)
                                            res.send({valid: false, error: 'non esisto lo stimolo inserito'})
                                        }
                                        else if (result.length !== 1) {
                                            console.log('esiste più di uno stimolo con lo stesso nome')
                                            res.send({valid: false, error: 'esiste più di uno stimolo con lo stesso nome'})
                                        }
                                        else {
                                            query = `
                                                INSERT INTO gamestimulus(codGame, codStimulus, duration, indexRow)
                                                VALUES (${gameId}, ${result[0].idStimulus}, ${duration}, ${index});
                                            `
                                            console.log(query)
                                            con.query(query, (err, result, fields) => {
                                                if (err) throw err;
                                                console.log(result)
                                                ok = true;
                                            })
                                        }
                                    })
                                }
                                if (ok) {
                                    console.log('sto mandando la risposta')
                                    valid = true
                                    logActivity('tentativo di aggiunta di un gioco  ' + (valid ? ' riuscito' : ' fallito'))
                                    res.send({valid: true, ok })
                                }
                            }
                        })
                    }
                })
            })
        })
    })
})

app.post('/delete_stimuli', (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        const stimuli = '"' + data.stimuli2del.map(s => s.name).join('", "') + '"'
        const fileNames = data.stimuli2del.map(s => s.file)
        const query = `
            DELETE FROM stimulus
            WHERE name IN (${stimuli});
        `
        con.query(query, (err, result, fields) => {
            if (err) throw err;
            console.log(result)
            const valid = result.affectedRows > 0;
            logActivity('tentativo di rimozione degli stimoli  ' + (valid ? ' riuscito' : ' fallito'))
            res.send({valid})
            if (valid) {
                for (const file of fileNames) {
                    if (fs.existsSync(file)) {
                        fs.unlink(file, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(file + ' deleted');
                        })
                    }
                }
            }
        })
    })
})

/*
image: 0,
video: 1,
text: 2,
audio: 3
*/

app.post('/get_stimulus_duration', (req, res) => {
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        console.log('ricevuta richiesta')

        const {type, file_name} = data
        
        console.log(type)
        if (type == 0) {
            res.send({valid: true, duration: 10})
        } else if (type == 1) {
            getVideoDurationInSeconds(file_name).then((duration) => {
                res.send({valid: true, duration: Math.round(duration)})
            }) 
        } else  if (type == 2) {
            const duration = fs.readFileSync(file_name).toString().split(' ').length / 2
            res.send({valid: true, duration})
        } else  if (type == 3) {
            getAudioDurationInSeconds(file_name).then((duration) => {
                res.send({valid: true, duration: Math.round(duration)})
            })
        }
    })
})


/*
const exampleGames = [
    {
        gameName: 'game1',
        stimuli: [
            {
            name: 'stimolo1',
            thumbnail: 'assets/imageLogo.png',
            file: '',
            },
        ]
    },
]*/

app.get("/get_all_games", (req, res) => {
    
    res = applyMiddleware(res)
    
    let query = `
        SELECT game.name AS gameName, stimulus.name AS stimulusName, stimulus.type, stimulus.file_name,  gamestimulus.indexRow, gamestimulus.duration
        FROM (game INNER JOIN (stimulus INNER JOIN gamestimulus ON stimulus.idStimulus = gamestimulus.codStimulus) ON game.idGame = gamestimulus.codGame);
    `
    con.query(query, (err, result, fields) => { 
        if (err) throw err; 
        //console.log(result)
        let gameObj = {}
        result.forEach(row => {
            const tempObj = { 
                "name": row.stimulusName, 
                "thumbnail": type_to_thumbnail[row.type], 
                "file": row.file_name,
                "index": row.indexRow,
                "duration": row.duration,
            }
            if (row.gameName in gameObj) {
                gameObj[row.gameName].push(tempObj)
            } else {
                gameObj[row.gameName] = [tempObj]
            }
        })

        //console.log(gameObj)

        let gamesList = []
        for (const gameName in gameObj) {
            let sorted = [...gameObj[gameName]].sort((first, second) => first.index - second.index)
            for (let i = 0; i < sorted.length; i++) {
                delete sorted[i]['index']
            } 
            gamesList.push({
                gameName,
                stimuli: sorted,
            })
        }

        //console.log(gamesList)
        res.send({
            valid:true,
            gamesList,
        })
    })
})






// duration
// file
// name
// thumbnail
app.post("/get_game_stimulus_rows", (req, res) => {
    
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        console.log('ricevuta richiesta')

        const gameName = data.currentGame
    
        let query = `
            SELECT stimulus.name, stimulus.type, stimulus.file_name,  gamestimulus.indexRow, gamestimulus.duration
            FROM (game INNER JOIN (stimulus INNER JOIN gamestimulus ON stimulus.idStimulus = gamestimulus.codStimulus) ON game.idGame = gamestimulus.codGame)
            WHERE game.name = '${gameName}';
        `
        con.query(query, (err, result, fields) => { 
            if (err) throw err; 
            
            let stimuliList = result.map(row => {
                return { 
                    "name": row.name, 
                    "thumbnail": type_to_thumbnail[row.type], 
                    "file": row.file_name,
                    "index": row.indexRow,
                    "duration": row.duration,
                }
            })

            
            let sorted = [...stimuliList].sort((first, second) => first.index - second.index)
            for (let i = 0; i < sorted.length; i++) {
                delete sorted[i]['index']
            } 

            console.log(sorted)

            res.send({
                valid:true,
                stimuliList: sorted,
            })
        })
    })
})

app.post("/delete_game", (req, res) => {
    
    res = applyMiddleware(res)
    evalRequest(req, (data) => {
        logActivity('ricevuta richiesta di cancellazione di un gioco')
        const gameName = data.gameName
    
        const query = `
            DELETE FROM game
            WHERE game.name = '${gameName}';
        `
        con.query(query, (err, result, fields) => { 
            if (err) throw err; 
            if (result.affectedRows > 0)
                res.send({
                    valid:true,
                })
            else 
                res.send({
                    valid:false,
                    errorMsg: 'nessun gioco è stato cancellato con name: ' + gameName
                })
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}, nice!`)
})
