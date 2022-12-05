# Sistemi ad Agenti

## Progetto EmoGame

Autori: 
- Andriani Claudio [725613]
- Dario Coppolecchia [725614]

### Idea di progetto
Per la realizzazione del caso di studio, abbiamo realizzato un software che ha come obiettivo finale quello di essere di supporto ai terapisti per il riconoscimento e l’analisi delle emozioni dei pazienti dati degli stimoli, questo viene effettuato mostrando al paziente diversi media come immagini, video, testi o audio, scelti da un terapista, in modo tale da cogliere le emozioni provate dal sottoposto attraverso il riconoscimento delle espressioni del volto. Il progetto consiste in un full-stack website che permette ai terapisti di:
1.	Aggiungere nuovi account terapisti;
2.	Gestire gli stimoli;
3.	Gestire i giochi;
4.	Avviare un gioco.

Durante la partita viene registrato il volto del paziente e viene anche generato un CSV che potrà essere salvato in locale sul dispositivo, per poter effettuare l’analisi in un secondo momento dagli addetti.

## Manuale utente
### Installazione

Per l'utilizzo del software sono necessari i seguenti software:

- Node.js
- MySQL 8.0

Per installare le librerie necessarie all'esecuzione dell'interfaccia e del server basterà eseguire il comando: 

`npm i` nelle cartelle `backend` e `emo_game_ui`

successivamente è necesario lanciare lo script del database attraverso il seguente comando in MySQL Shell:

`source *PATH*/EmoGame/database/DBCreationScript.sql`

infine bisognare avviare il server e l'interfaccia utente tramite il comando nelle rispettive directory:

`npm start`
### Utilizzo

Quando ci si approccia al sito, la prima schermata che verrà visualizzata sarà quella di login, in cui un terapista potrà effettuare l’accesso utilizzando le credenziali registrate sul server oppure, un paziente potrà accedere senza effettuare il login per iniziare a giocare.  

![Immagine1](https://user-images.githubusercontent.com/79840292/205689714-d22d88fd-6ee5-42eb-a3ab-2b0acf4d95e8.png)

Una volta effettuato l’accesso (come terapista) si aprirà il menù iniziale che permetterà di accedere a tutte le varie sottosezioni del sito. In questo caso è stato effettuato l’accesso con un account di testing.

![Immagine2](https://user-images.githubusercontent.com/79840292/205689974-56d82392-45ff-409b-b206-1435d4d98c84.png)

Si può scegliere l’operazione da effettuare tramite il menù principale o tramite la NavBar. 

Gestione stimoli
La prima sottosezione esplorabile è quella inerente agli stimoli e alla loro gestione; infatti, un terapista in questa parte del sito potrà effettuare le seguenti operazioni:
a.	Aggiungere uno stimolo
b.	Visualizzare gli stimoli
c.	Cancellare uno stimolo
a.	Aggiungere uno stimolo
In questa fase l’utente dovrà: scegliere un nome per lo stimolo da inserire (deve essere differente dagli stimoli già presenti nel database), inserire il file dello stimolo dal dispositivo (sono supportati solo file di tipo png, jpeg, jpg, mp4, txt, mp3 e ogg) e infine scegliere una categoria. Eventualmente, se non vi è alcuna categoria attinente allo stimolo da inserire se ne può aggiungere un’altra semplicemente scrivendo il nome di essa e cliccando il tasto “+” sulla destra. Una volta compilato il form si può effettuare l’aggiunta dello stimolo. 

![Immagine3](https://user-images.githubusercontent.com/79840292/205690109-12c73445-8b5d-4192-a6ac-f3f8792038c5.png)

b.	Visualizzare gli stimoli
In questa sottosezione, l’utente potrà visualizzare tutti gli stimoli caricati sul server dai vari terapisti, suddivisi in categorie, ogni stimolo ha una propria icona rappresentante il tipo di file dello stimolo

![Immagine4](https://user-images.githubusercontent.com/79840292/205690288-f3a38faa-aff4-4801-a417-e31f9006c194.png)

Inoltre, selezionandone uno, l’utente potrà visualizzarne il contenuto

![Immagine5](https://user-images.githubusercontent.com/79840292/205690390-e98f4512-8aae-44b2-9019-21310b5fabb2.png)

c.	Cancellare uno stimolo
Se un terapista vorrà cancellare uno o più stimoli presenti nel server, gli apparirà la stessa schermata mostrata in precedenza per la selezione degli stimoli da riprodurre, ma in questo caso avrà la possibilità di selezionare più di uno stimolo. Una volta scelti gli stimoli da eliminare, si aprirà un modale in cui l’utente dovrà confermare la volontà di rimuovere gli stimoli selezionati dal database. 


![Immagine6](https://user-images.githubusercontent.com/79840292/205690446-df10c0c0-953e-416a-80c8-b7ef8972253e.png)

Confermando l’operazione, non si potranno più recuperare gli stimoli. Eliminando tutti gli stimoli di una categoria, quest’ultima rimarrà salvata nel server e quindi disponibile per le aggiunte future.

Gestione giochi
Nella seconda sottosezione, il terapista potrà effettuare le seguenti operazioni riguardo ai giochi (ossia un insieme di stimoli mostrati in sequenza):
a. Aggiungere un gioco 
b. Modificare un gioco
c. Cancellare un gioco

a.	Aggiungere un gioco
In questa interfaccia, il terapista per aggiungere un nuovo gioco, deve inserire il nome che vuole assegnare al gioco (non deve essere già presente nel database) e poi successivamente aggiungere i vari stimoli che devono essere presenti nel gioco. Il primo stimolo va aggiunto attraverso il tasto “Aggiunti stimolo in coda”, dove una volta selezionato si aprirà la videata della visualizzazione degli stimoli mostrata in precedenza per effettuare l’aggiunta. Una volta aggiunti gli stimoli si possono effettuare le seguenti operazioni:
-	Modifica dell’ordine di visualizzazione degli stimoli
-	Modifica della durata di un singolo stimolo all’interno del gioco, nello specifico non viene modificata la durata base di uno stimolo ma bensì solo la durata dello stimolo all’interno dello specifico gioco (non è possibile modificare la durata dei video e dei file audio) 
-	Aggiungere uno stimolo attraverso il tasto “+” presente su ogni stimolo, questo permetterà di aggiungere un nuovo stimolo in successione rispetto a quello a cui è stato premuto il tasto “+”, al contrario del tasto riposto in basso “Aggiungi stimolo in coda” che aggiunge uno stimolo in coda all’ultimo stimolo presente nell’elenco
-	Cancellare uno stimolo dall’elenco, infatti, attraverso il tasto “x” di ogni singolo stimolo si potrà rimuovere esso dal gioco.
Quando l’utente avrà terminato la fase di aggiunta degli stimoli, potrà confermare la creazione del gioco cliccando il pulsante riposto in basso a destra del modale “Conferma creazione” che salverà il gioco nel server. 


![Immagine7](https://user-images.githubusercontent.com/79840292/205690551-436a814a-4757-4e6e-9369-7c66301b29e7.png)

b.	Modificare un gioco
In questa sottosezione, il terapista per modificare un gioco già precedentemente aggiunto nel server, deve inizialmente selezionare il gioco su cui effettuare le modifiche, attraverso la seguente schermata:

![Immagine8](https://user-images.githubusercontent.com/79840292/205690679-12840dc1-a803-435c-892d-2af8d82adecd.png)

Se non vi sarà nessun gioco presente, l’interfaccia mostrerà un pulsante che porterà alla sezione di aggiunta di un gioco. Altrimenti, dopo aver selezionato il gioco su cui effettuare le modifiche e aver cliccato “Modifica gioco” per confermare la scelta, il terapista ha la possibilità di effettuare modifiche attraverso la stessa schermata di creazione del gioco, ovviamente con le stesse possibilità.

c.	Cancellare un gioco
Per quanto riguarda la cancellazione di un gioco, il terapista potrà selezionare un gioco nello stesso modo in cui vengono selezionati i giochi su cui effettuare le modifiche e una volta selezionato il gioco, apparirà un modale che chiede conferma di cancellazione al terapista. Una volta confermata la cancellazione non è più possibile recuperare il gioco creato. Ovviamente non verranno cancellati gli stimoli nel gioco ma solo le informazioni riguardanti esso.
Gioca
In questa sezione un terapista o un paziente, potrà effettivamente provare un gioco precedentemente caricato sul server. Una volta selezionata verrà mostrata la seguente interfaccia:

![Immagine9](https://user-images.githubusercontent.com/79840292/205690864-259da969-bd68-4754-98eb-be4de869de6b.png)

L’utente dovrà, come prima cosa inserire il nome del giocatore, che, ovviamente può essere diverso da quello con cui ha effettuato l’accesso, successivamente deve selezionare un gioco da far partire. In caso di assenza di giochi all’interno del database l’interfaccia mostrerà un pulsante che porterà alla sezione per aggiungerne uno. Inoltre, l’utente avrà la possibilità di scegliere se registrare effettivamente il volto del paziente tramite la webcam e se mostrare il nome del gioco e dello stimolo (che potrebbero alterare le emozioni provate dal sottoposto). Dopo aver accuratamente selezionato tutte le impostazioni corrette, e dopo aver cliccato sul pulsante “Inizio gioco”, inizierà la visualizzazione in sequenza dei vari stimoli come mostrato in figura:

![Immagine10](https://user-images.githubusercontent.com/79840292/205690996-415fb0d0-153d-4c06-998b-85520423fe65.png)

In questo caso si è scelto di non mostrare il nome del gioco e degli stimoli. Una volta terminata la sequenza di stimoli, all’utente apparirà la seguente interfaccia:

![Immagine11](https://user-images.githubusercontent.com/79840292/205691145-63ef6ebf-a8e5-4ef1-951b-18f2ccea9e18.png)

L’utente, infatti, potrà effettuare il download del video registrato dalla webcam durante tutta la durata del gioco (ovviamente se si è scelto di non registrare il volto questo pulsante non sarà visibile), inoltre si potrà effettuare il download di un file CSV generato dal server, con nome generato automaticamente con il formato “Giocatore_Gioco_Data_Ora”, che ha memorizzato i dati della partita. Nello specifico il csv avrà il seguente formato:

![Immagine12](https://user-images.githubusercontent.com/79840292/205691261-29e5701f-74cf-475a-9ba7-39f4d9e65e85.png)

Per ogni stimolo del gioco ne viene salvato: il nome, il timestamp dell’inizio dello stimolo in modo tale da poter riconoscere le emozioni per ogni singolo stimolo tramite il video, il percorso del file dello stimolo e la durata dello stimolo all’interno del gioco.
Analizza risultati giochi
Questa sezione non è stata sviluppata. Né è stato preimpostato il pulsante e la pagina per eventuali sviluppi futuri
Crea account terapista
Nell’ultima funzionalità principale del sito è possibile effettuare la registrazione di un nuovo account terapista. La registrazione di un nuovo terapista è possibile solo se è stato effettuato l’accesso con un altro. Quindi, l’utente dovrà compilare il form con una mail (non deve essere già presente nel database) e una password con i seguenti vincoli:
-	Lunghezza dagli 8 ai 16 caratteri
-	Deve contenere lettere minuscole
-	Deve contenere lettere maiuscole
-	Deve contenere simboli
-	Deve contenere almeno un numero

![Immagine13](https://user-images.githubusercontent.com/79840292/205691501-a5b50409-8938-4786-b587-c1068ad3c806.png)

Se i requisiti sono soddisfatti verrà aggiunto un nuovo account al database, altrimenti verranno mostrati messaggi di errore in base al vincolo non rispettato.




