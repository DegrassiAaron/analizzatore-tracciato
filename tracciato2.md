Seguono la definizione dei blocchi,  con (0, "COD_COMP", 0, 3, 0) = (ordine,nome campo,posizione iniziale ,lunghezza ,precisione numerica) , ma possono avere meno campi
   Ogni riga del tracciato appartiene a un blocco e ci possono essere piu' righe per lo stesso blocco. 
   Le proprietà di una riga sono definite da uno delle classi seguenti,attraverso la proprietà Table Contratto.Table è associato al blocco CNT per esempio.
   Il tipo di Field definisce come valutare la stringa del tracciato. Se Signed la proprieta e' un + seguiti da un numero numero un certo numero di caratteri.Per esempio 
   Field.Signed(0, "COD_COMP", 0, 3, 0); sará +___ . Se Date sará una data, lungo 10 caratteri, YYYY-MM-DD. Se Text sara' una stringa, lunga N caratteri,TimeStamp sara' un timestamp	
	una stringa lunga 28 caratteri tipo 0001-01-01-00.00.00.000000 con YYYY-MM-DD-HH.MM.SS.000000

Definizione Incroci anagrafici
Un incrocio anagrafico è il rapporto tra una scheda di un contratto e una entita anagrafica, con ruolo COD_RUOLO (una entita puo' essere in relazione con la stessa scheda con diversi ruoli, 
una entita puo' essere in relazione a piu' schede e una scheda a piu' entità)
Seguono questa decodifica delle proprietà del blocco

    public static class INCR_CR
    {
        public static readonly Table Table = new Table(0, "INCR_CR", false, 200);
        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field KEY_OGG_RISCHIO = Field.Signed(5, "KEY_OGG_RISCHIO", 40, 11, 0);
        public static readonly Field COD_RUOLO = Field.Signed(6, "COD_RUOLO", 52, 2, 0);
        public static readonly Field DAT_FINE_VALI = Field.Text(7, "DAT_FINE_VALI", 55, 10);
        public static readonly Field PRG_ENTITA = Field.Signed(8, "PRG_ENTITA", 65, 5);
        public static readonly Field PRG_GRUPPO = Field.Signed(9, "PRG_GRUPPO", 150, 5);
        public static readonly Field FLG_IS_MODIFIED = Field.Text(10, "FLG_IS_MODIFIED", 156, 1);
    }

I blocchi con i nomi
"CPERSGRUP":
"CPERSONA": persona
"CNATANTE": natante
"CPERSAERO":
"CUBICAZIONE": ubigazione
"CUBICAZGRUP":
"CUBICAZAERO":
"CFABBRICATO": fabbricato
"CIMPRESA": impresa
"CIMPRESAGRUP":
"CATTIVITA": attivita
"CVEICOLO": veicolo
"CENTITASTRINGA" entita stringa
"CGRUPPOANAG":
"CAEROMOBILE": aeromobile
"CUSISPECIALI":
"CANIMALE": animale
sono le figure anagrafiche
Quelli con i nomi
"CRELAZIONERR": relazione tra due entita anagrafiche
"CRELAZIONEGR":
"CRELAZRRAERO":
"CRELAZRRGRUP":
sono relazioni tra entita anagrafiche
Mentre
CRELAZIONECR": identifica un incrocio.