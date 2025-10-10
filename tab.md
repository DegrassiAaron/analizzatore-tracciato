Definiamo la tab Dati Contratto
Visualizziamo i dati raccolti da uno o piu' blocchi per visualizzare i dati del contratto.
In questa tab si raggruppano i dati trovati in CNT,AGE,PRT,COA,CVP.
Saranno cosi' definiti: 
idBlocco
	nome proprietà,     label:tipo proprietà
Saranno visualizzati ad albero
CNT: 
	COD_COMP, 			Compagnia:numero
	NUM_CONTRATTO, 		Contratto:numero
	PRG_CONTRATTO, 		Progressivo:numero
	NUM_AGENZIA 		Numero Agenzia:numero
	DAT_DECORRENZA, 	Data Decorrenza:data
	DAT_SCADENZA,		Data Scadenza:data
	DAT_FINE_VAL,		Data fine validita:data
	COD_ANNULL_CON 		Codice annullo contratto:stringa 
	DAT_ANNULL_CON 		Data annullo contratto:data 
	TIP_PORTAF, 		Tipo portafoglio:stringa
	TIP_STRUTTURA 		Tipo struttura
	COD_STATO_PTF,		Codice stato portafoglio:stringa
	COD_PRODOTTO_GRV 	Codice prodotto GRV:numero
	COD_PROD_SUPER 		Codice prodotto super:stringa
	COD_EDIZ_STAMPATO	Codice edizione stampato:stringa
	COD_RAMOPOL 		Codice ramo polizza:numero
	FLG_DIGITALE 		Digiale:stringa
	COD_PROPOSTA		Codice proposta:stringa,
	COD_MODULARE 		Codice modulare:stringa
	TIP_DOCUMENTO_MOD	Tipo Documento Mod:string
	NUM_DOCUMENTO_MOD	Numero Documento Mod:numero	
	NUM_DURATA 			Durata:numero
	COD_FRAZIONAMENTO	Codice Frazionamento:stringa
	COD_ESENZIONE 		Codice Esenzione:stringa
	COD_COASS 			Codice coassicurazione:stringa
	COD_VINCOLO 		Codice vincolo:stringa
	COD_RINNOVO 		Codice rinnovo:stringa
	DAT_RIF_TABELLE 	Data riferimento tabelle:data
	COD_CONGUAGLIO 		Codice conguaglio:stringa
	DAT_RIATTIVAZ 		Data riattivazione:data
	COD_RIASS 			Codice Riassicurazione:stringa
	COD_INDICIZZ 		Codice indicizzazione:stringa
	COD_BLOK_INDIC		Codice blocco indicizzazione:Stringa
	COD_TAB_INDIC 		Codice tabella indicizzazione:stringa
	PER_NS_QUOTA 		Percentuale nostra quota:numero
	DAT_INIZ_VAL		Data inizio validita:data
AGE
	NUM_AGENZIA 		Numero Agenzia:numero
	COD_SUBAGENZIA    	Codice subagenzia:stringa
	COD_SUBAGENTE 		Codice subagente:stringa
COA (coassicurazione)
CVP (convenzione)

 Definiamo la tab dati schede
 In dati schede voglio vedere la lista dei gruppi assicurati. All'interno , visualizzati a grafo, si vedono i rappoorti con schede,entita anagrafiche.Ogni scheda puo' espandersi per visualizzare
 la lista di partite e le partite possono espandersi per visualizzare le partite contabili.
 In questa tab si raggruppano i dati trovati in COI,SCH,PRT,PCB,PAX.
 Ogni scheda del contratto ha come identificativo il valore PRG_SCHEDA. Ogni scheda è legata a partite attraverso questo progressivo scheda. Ogni entità anagrafica e' legata alle schede
 attraverso il progressivo scheda.
 Struttura delle Entità del Sistema Assicurativo
Il sistema è organizzato gerarchicamente come segue:
1. Gruppo Assicurativo (livello principale)

Contiene una lista di Entità Anagrafiche
Contiene una lista di Schede

2. Gruppo Anagrafico

Può avere una o più Entità Anagrafiche (relazione 1-a-molti)
Può avere una o più Schede (relazione 1-a-molti)
Proprietà:

pxg
tipo_pxg


Due modalità di definizione:

Se esistono blocchi COI con TXT_DATO = "GRUPPO":

Usare i dati COI per definire i gruppi
Verificare conformità con CRELAZIONECR (avvisare se non conforme)


Se NON esistono blocchi COI con TXT_DATO = "GRUPPO":

Creare i gruppi usando i blocchi CRELAZIONECR





Blocchi COI (quando TXT_DATO = "GRUPPO"):

progressivo_gruppo (identifica il gruppo anagrafico)
chiave_entita_anagrafica (riferimento all'entità)
progressivo_scheda (riferimento alla scheda)
pxg (proprietà del gruppo anagrafico)
tipo_pxg (proprietà del gruppo anagrafico)

Blocchi CRELAZIONECR:

Legano Entità Anagrafiche a Schede
Servono come:

Validazione quando esistono COI GRUPPO (i dati devono essere conformi)
Fonte primaria per creare gruppi quando non esistono COI GRUPPO



3. Scheda

Definita nei blocchi SCH
Contiene una lista di Partite
Identificata da: prg_scheda (progressivo scheda)
Può appartenere a uno o più Gruppi Anagrafici

4. Partita

Definita nei blocchi PAR
Appartiene a una Scheda specifica
Contiene una lista di Partite Contabili
Identificata da: prg_partita (progressivo partita)
Collegata alla scheda tramite: prg_scheda

5. Partita Contabile

Definita nei blocchi PCB
Appartiene a una Partita specifica
Collegata tramite: prg_scheda + prg_partita

Blocchi di Definizione:

COI: Gruppi Anagrafici e loro associazioni (quando TXT_DATO = "GRUPPO")
CRELAZIONECR: Relazioni Entità-Scheda (validazione o fonte alternativa)
SCH: Schede
PAR: Partite
PCB: Partite Contabili

Logica di Controllo:

Se esistono COI GRUPPO → usare COI e verificare conformità con CRELAZIONECR
Se NON esistono COI GRUPPO → creare gruppi da CRELAZIONECR

Relazioni Chiave:

Gruppo Anagrafico ↔ Entità Anagrafiche: 1 a molti
Gruppo Anagrafico ↔ Schede: 1 a molti
Scheda ↔ Partita: collegate tramite prg_scheda
Partita ↔ Partita Contabile: collegate tramite prg_scheda + prg_partita


Le entita sono definite con il seguente codice
 private void DoAttivita(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(ATTIVITA_BATCH.COD_KEY_EA));
                AttivitaBatch attivita = new AttivitaBatch(keyEa);
                attivita.RiferimentoCatalogo = SafeConvert.ToInt(th.GetFieldContent(ATTIVITA_BATCH.NUM_RIFE_ATTI));
                attivita.CodiceCatalogo = SafeConvert.ToInt(th.GetFieldContent(ATTIVITA_BATCH.COD_CATALOGO));
                AddEntitaInBuffer(attivita);

            }
        }

        private void DoFabbricati(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(FABBRICATO_BATCH.COD_KEY_EA));
                FabbricatoBatch fabbricato = new FabbricatoBatch(keyEa);
                fabbricato.AnnoCostruzione = SafeConvert.ToInt(th.GetFieldContent(FABBRICATO_BATCH.NUM_ANNO_EDIF));
                fabbricato.CodiceDestinazioneUso = SafeConvert.ToInt(th.GetFieldContent(FABBRICATO_BATCH.COD_DEST_USO));
                fabbricato.NumeroPiani = SafeConvert.ToInt(th.GetFieldContent(FABBRICATO_BATCH.NUM_PIANI));

                AddEntitaInBuffer(fabbricato);
            }
        }

        private void DoImprese(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(IMPRESA_BATCH.COD_KEY_EA));
                ImpresaBatch impresa = new ImpresaBatch(keyEa);
                impresa.CodiceRagioneSociale = th.GetFieldContent(IMPRESA_BATCH.COD_RAGI_SOCI).ToString().Trim();
                impresa.RagioneSociale = th.GetFieldContent(IMPRESA_BATCH.TXT_RAGI_SOCI).ToString().Trim();
                impresa.CodiceFiscale = th.GetFieldContent(IMPRESA_BATCH.COD_FISCALE).ToString().Trim();
                impresa.PartitaIVA = th.GetFieldContent(IMPRESA_BATCH.COD_PART_IVA).ToString().Trim();
                impresa.NazionePartitaIVA = th.GetFieldContent(IMPRESA_BATCH.COD_NAZI_PIVA).ToString().Trim();
                impresa.FormaGiuridica = th.GetFieldContent(IMPRESA_BATCH.TIPO_ENTE).ToString().Trim();
                impresa.CodiceUnitaMercato = SafeConvert.ToInt(th.GetFieldContent(IMPRESA_BATCH.COD_UNIT_MERC));
                impresa.NumeroDipendenti = SafeConvert.ToInt(th.GetFieldContent(IMPRESA_BATCH.COD_NUM_DIPE));
                impresa.FasciaFatturato = SafeConvert.ToInt(th.GetFieldContent(IMPRESA_BATCH.COD_FASC_FATT));
                AddEntitaInBuffer(impresa);
            }
        }

        private void DoPersone(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {

                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(PERSONA_BATCH.COD_KEY_EA));
                PersonaBatch persona = new PersonaBatch(keyEa);
                persona.CodiceFiscale = th.GetFieldContent(PERSONA_BATCH.COD_FISCALE).ToString().Trim();
                persona.Cognome = th.GetFieldContent(PERSONA_BATCH.TXT_COGNOME).ToString().Trim();
                persona.Nome = th.GetFieldContent(PERSONA_BATCH.TXT_NOME).ToString().Trim();
                DateTime dataN = SafeConvert.ToDate(th.GetFieldContent(PERSONA_BATCH.DAT_NASCITA));
                persona.DataNascitaL = new Data(dataN).ToInt();

                SessoRV sessoRv;
                char sesso = SafeConvert.ToChar(th.GetFieldContent(PERSONA_BATCH.COD_SESSO));
                switch (sesso)
                {
                    case 'M':
                        sessoRv = SessoRV.Maschio;
                        break;
                    case 'F':
                        sessoRv = SessoRV.Femmina;
                        break;
                    default:
                        sessoRv = SessoRV.Undefined;
                        break;
                }
                persona.Sesso = sessoRv;
                persona.Titolo = th.GetFieldContent(PERSONA_BATCH.COD_TITOLO).ToString().Trim();
                persona.CodiceProfessione = SafeConvert.ToInt(th.GetFieldContent(PERSONA_BATCH.COD_PROFESSIO));
                persona.CodiceUnitaMercato = SafeConvert.ToInt(th.GetFieldContent(PERSONA_BATCH.COD_UNIT_MERC));

                AddEntitaInBuffer(persona);
            }
        }
        private void DoNatante(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(NATANTE_BATCH.COD_KEY_EA));
                NatanteBatch natante = new NatanteBatch(keyEa);
                MotoreBatch motore = new MotoreBatch();
                motore.Matricola = th.GetFieldContent(NATANTE_BATCH.MATR).ToString().Trim();
                motore.Alimentazione = 0;
                motore.AnnoCostruzione = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.ANNO_COST));
                motore.CavalliEffettivi = 0;
                motore.CavalliFiscali = 0;
                motore.Cilindrata = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.LITR_SERB)); 
                motore.KiloWatt = 0;
                motore.Progressivo = 0;
                motore.TipoMotore = 0;
                natante.AddMotore(motore);

                natante.CodiceChiave = (SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.CHIAVE)));
                natante.CodiceDestinazioneUso = (SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.DEST_USO)));
                natante.Modello = th.GetFieldContent(NATANTE_BATCH.MODELLO).ToString().Trim();
                natante.Nome = th.GetFieldContent(NATANTE_BATCH.NOME).ToString().Trim();
                var siglCost = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.SIGL_COST));
                natante.Bandiera = th.GetFieldContent(NATANTE_BATCH.BANDIERA).ToString().Trim();
                var tempNatante = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.NATANTE));
                natante.CodiceDestinazioneUso = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.TIPO_USO));
                natante.CodiceBandieraLPS = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.BAND_LPS));
                natante.CodiceNazione = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.NAZIONE));
                var perizia = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.PERIZIA));
                natante.NumeroMotori = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.MOTORI));
                natante.AnnoCostruzione = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.ANNO_COST));
                var meseCost = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.MESE_COST));
                natante.Stazza = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.STAZ_LORD));
                natante.Lunghezza = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.LUNGHEZZA));
                natante.NumeroPosti = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.POSTI));
                natante.MaxVelocita = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.NODI_VELO));
                natante.MaterialeCostruzioneCatalogo = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.MATE_COST));
                var specAlbe = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.SPEC_ALBE));
                natante.CodiceSatelitare = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.SATELLITARE));
                var colore = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.COLORE));
                var larghezza = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.LARGHEZZA));
                var pescaggio = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.PESCAGGIO));
                natante.MaxVelocita = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.VELO_CROC));
                var armamento = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.ARMAMENTO));
                var consumo = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.CONSUMO));
                var elettronica  = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.ELETTRONICA));
                var sat1 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.SAT1));
                var sat2 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.SAT2));
                var sat3 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.SAT3));
                var gsm1 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.GSM1));
                var gsm2 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.GSM1));
                var gsm3 = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.GSM3));
                var indiUso = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.INDI_USO));
                var porto = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.PORTO));
                var catPorto = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.CAT_PORT));
                var rifePorto = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.RIFE_PORT));
                var settore = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.SETTORE));
                var classe = SafeConvert.ToString(th.GetFieldContent(NATANTE_BATCH.CLASSE));
                natante.UsoLavorativo = SafeConvert.ToInt(th.GetFieldContent(NATANTE_BATCH.USO)).ToString();
                var dataInizio = SafeConvert.ToDate(th.GetFieldContent(NATANTE_BATCH.DAT_INIZ_VALI));
                var oraInizio = SafeConvert.ToDate(th.GetFieldContent(NATANTE_BATCH.ORA_INIZ_VALI));
                var fineValidita = SafeConvert.ToDate(th.GetFieldContent(NATANTE_BATCH.DAT_FINE_VALI));
                AddEntitaInBuffer(natante);
            }
        }
        private void DoGruppiAnag(IList<ITableHolder> ths)
        {
            // List<PersonaBatch> aderenti = new List<PersonaBatch>();
            // IList<ITableHolder> thsGruppo = TableHolderListCreatorHelper.GetThsByName("GRUPPOANAG_BATCH", ths);
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(GRUPPOANAG_BATCH.COD_KEY_EA));
                NucleoFamiliareBatch nb = new NucleoFamiliareBatch(keyEa);
                nb.ComponentiNucleo = new List<IPersonaRV>();
                nb.TxtGruppo = SafeConvert.ToString(th.GetFieldContent(GRUPPOANAG_BATCH.TXT_GRUPPO));
                nb.CodiceGruppo = SafeConvert.ToInt(th.GetFieldContent(GRUPPOANAG_BATCH.COD_GRUPPO));
                nb.TipoGruppo = SafeConvert.ToString(th.GetFieldContent(GRUPPOANAG_BATCH.TIPO_GRUPPO));
                nb.Descrizione = SafeConvert.ToString(th.GetFieldContent(GRUPPOANAG_BATCH.TXT_GRUPPO));
                AddEntitaInBuffer(nb);
            }
            //IList<ITableHolder> thsAderenti = TableHolderListCreatorHelper.GetThsByName("PERSONAGRUP_BATCH", ths);
            //aderenti = GetPersoneGrup(thsAderenti);
            //ApplyRelazioniGR(aderenti, ths);

        }

        private void DoUbicazioni(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                IUbicazioneRV ubicazione = null;
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(UBICAZIONE_BATCH.COD_KEY_EA));
                UbicazioneBatch ubiB = new UbicazioneBatch(keyEa);
                ubiB.Key = keyEa;
                ubiB.CodiceTerritorio = SafeConvert.ToInt(th.GetFieldContent(UBICAZIONE_BATCH.COD_TERRITORIO));
                ubiB.Cap = th.GetFieldContent(UBICAZIONE_BATCH.COD_CAP).ToString().Trim();
                ubiB.Comune = th.GetFieldContent(UBICAZIONE_BATCH.TXT_COMUNE).ToString().Trim();
                ubiB.SiglaProvincia = th.GetFieldContent(UBICAZIONE_BATCH.COD_PROVINCIA).ToString().Trim();
                ubiB.Localita = th.GetFieldContent(UBICAZIONE_BATCH.TXT_LOCALITA).ToString().Trim();
                ubiB.Scala = th.GetFieldContent(UBICAZIONE_BATCH.NUM_SCALA).ToString().Trim();
                ubiB.Nazione = th.GetFieldContent(UBICAZIONE_BATCH.COD_NAZIONE).ToString().Trim();
                ubiB.Toponimo = th.GetFieldContent(UBICAZIONE_BATCH.TXT_PREF_BREV).ToString().Trim();
                ubiB.NumeroCivico = th.GetFieldContent(UBICAZIONE_BATCH.NUM_CIVICO).ToString().Trim();
                ubiB.NomeVia = th.GetFieldContent(UBICAZIONE_BATCH.TXT_INDIRIZZO).ToString().Trim();
                ubicazione = ubiB;
                AddEntitaInBuffer(ubiB);
            }
        }

        private void DoVeicoli(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(VEICOLO_BATCH.COD_KEY_EA));
                VeicoloBatch veicolo = new VeicoloBatch(keyEa);
                veicolo.Targa = th.GetFieldContent(VEICOLO_BATCH.TXT_TARGA_TELA).ToString().Trim();
                veicolo.Marca = th.GetFieldContent(VEICOLO_BATCH.COD_MARCA).ToString().Trim();
                veicolo.Modello = th.GetFieldContent(VEICOLO_BATCH.COD_MODELLO).ToString().Trim();
                veicolo.Versione = th.GetFieldContent(VEICOLO_BATCH.COD_VERSIONE).ToString().Trim();
                veicolo.SetRiferimentoTipoVeicolo(SafeConvert.ToInt(th.GetFieldContent(VEICOLO_BATCH.COD_TIPO_VEIC)));
                DateTime dataPrimaImm = SafeConvert.ToDate(th.GetFieldContent(VEICOLO_BATCH.DAT_IMMATRICOLAZIO));
                veicolo.DataPrimaImmatricolazione = new Data(dataPrimaImm);

                //veicolo.SiglaTarga = th.GetFieldContent(VEICOLO_BATCH.)
                AddEntitaInBuffer(veicolo);

            }
        }

        private void DoStringhe(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(STRINGA_BATCH.COD_KEY_EA));
                EntitaStringaBatch entitaString = new EntitaStringaBatch(keyEa);
                entitaString.ValoreStringa = th.GetFieldContent(STRINGA_BATCH.TXT_STRINGA).ToString().Trim();
                if (entitaString.ValoreStringa.StartsWith("veicolo ", StringComparison.InvariantCultureIgnoreCase) || entitaString.ValoreStringa.Contains("Targa"))
                {
                    VeicoloBatch veicolo = new VeicoloBatch(keyEa);
                    string[] valori = entitaString.ValoreStringa.Split(';');
                    veicolo.SetRiferimentoTipoVeicolo(SafeConvert.ToInt(valori[1].Split('/')[1]));
                    veicolo.Targa = valori[2];
                    //   desc + ";" + catalogo + "/" + riferimento + "/" + lista + ";" + targa;
                    AddEntitaInBuffer(veicolo);
                }
                if (entitaString.ValoreStringa.StartsWith("categoria", StringComparison.InvariantCultureIgnoreCase))
                {
                    CategoriaBatch categoria = new CategoriaBatch(keyEa);
                    string[] valori = entitaString.ValoreStringa.Split(';');
                    categoria.CodiceCatalogo = SafeConvert.ToInt(valori[1]);
                    categoria.RiferimentoCatalogo = SafeConvert.ToInt(valori[2]);
                    AddEntitaInBuffer(categoria);
                }
                else
                {
                    AddEntitaInBuffer(entitaString);
                }

            }
        }

        private void DoAeromobili(IList<ITableHolder> ths)
        {
            foreach (ITableHolder th in ths)
            {
                long keyEa = SafeConvert.ToInt64(th.GetFieldContent(AEROMOBILE_BATCH.COD_KEY_EA));
                AeromobileBatch aero = new AeromobileBatch(keyEa);
                aero.TipoAeromobile = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.COD_TIPOL));

                string targa = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.COD_IDTARGA));
                string nazone = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.COD_NAZIONE));

                aero.Marca = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.TXT_MARCA));
                aero.Modello = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.TXT_MODELLO));
                aero.Peso = SafeConvert.ToInt(th.GetFieldContent(AEROMOBILE_BATCH.VAL_PESO));
                aero.PostiPilota = SafeConvert.ToInt(th.GetFieldContent(AEROMOBILE_BATCH.POSTI_PIL));
                aero.PostiPasseggero = SafeConvert.ToInt(th.GetFieldContent(AEROMOBILE_BATCH.POSTI_PAS));
                aero.PostiTecnico = SafeConvert.ToInt(th.GetFieldContent(AEROMOBILE_BATCH.POSTI_TEC));

                aero.NumeroCostruzione = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.NUM_COSTRUZ));
                aero.descUsoNormale = SafeConvert.ToString(th.GetFieldContent(AEROMOBILE_BATCH.COD_USO));
                AddEntitaInBuffer(aero);
            }
        }

        private void DoUsiSpeciali(IList<ITableHolder> listTh)
        {
            foreach (ITableHolder thUsoSpeciale in listTh)
            {
                long keyEaUso = SafeConvert.ToInt64(thUsoSpeciale.GetFieldContent(USISPECIALI_BATCH.COD_KEY_EA));
                int codCatalogo = SafeConvert.ToInt(thUsoSpeciale.GetFieldContent(USISPECIALI_BATCH.COD_CATALOGO));
                //int riferimento = SafeConvert.ToInt(thUsoSpeciale.GetFieldContent(USISPECIALI_BATCH.rif));
                string txtDesAltro = SafeConvert.ToString(thUsoSpeciale.GetFieldContent(USISPECIALI_BATCH.TXT_DES_ALTRO));

                foreach (EntitaBatch.EntitaBatch entita in _entitaBuffer)
                {

                    if (entita.Key == keyEaUso)
                    {
                        if (entita is AeromobileBatch)
                        {
                            AeromobileBatch aero = entita as AeromobileBatch;
                            if (aero.UsiSpeciali == null)
                                aero.UsiSpeciali = new List<IUsoAeromobile>();
                            aero.UsiSpeciali.Add(new UsoAeromobile(342, codCatalogo, txtDesAltro));
                        }
                    }
                }
            }
        }

        private void DoAnimali(IList<ITableHolder> listTh)
        {
            foreach (ITableHolder thAnimale in listTh)
            {
                long keyEa = SafeConvert.ToInt64(thAnimale.GetFieldContent(ANIMALE_BATCH.COD_KEY_EA));
                AnimaleBatch animale = new AnimaleBatch(keyEa);
                var dataN = SafeConvert.ToDate(thAnimale.GetFieldContent(ANIMALE_BATCH.DAT_NASCITA));
                animale.DataNascitaL = new Data(dataN).ToInt();
                // animale.DescrizioneRazza = SafeConvert.ToString(thAnimale.GetFieldContent())
                animale.RiferimentoRazza = SafeConvert.ToInt(thAnimale.GetFieldContent(ANIMALE_BATCH.COD_RAZZA));
                animale.Microchip = SafeConvert.ToString(thAnimale.GetFieldContent(ANIMALE_BATCH.COD_MICROCHIP));
                animale.Nome = SafeConvert.ToString(thAnimale.GetFieldContent(ANIMALE_BATCH.TXT_NOME));
                animale.Specie = (TipoAnimale)SafeConvert.ToInt64(thAnimale.GetFieldContent(ANIMALE_BATCH.COD_SPECIE));
                SessoRV sessoRv;
                char sesso = SafeConvert.ToChar(thAnimale.GetFieldContent(ANIMALE_BATCH.COD_SESSO));
                switch (sesso)
                {
                    case 'M':
                        sessoRv = SessoRV.Maschio;
                        break;
                    case 'F':
                        sessoRv = SessoRV.Femmina;
                        break;
                    default:
                        sessoRv = SessoRV.Undefined;
                        break;
                }
                animale.Sesso = sessoRv;
                AddEntitaInBuffer(animale);
            }
        }
            
        private void AddEntitaInBuffer(EntitaBatch.EntitaBatch entita)
        {
            if (entita.ID != 0)
                _entitaBuffer.Add(entita);
            else
                LogHelperWrapper.TraceDebugInfo("Entita con id 0 non inserita");
        }

        private void ApplyRelazioniRR(IList<ITableHolder> list)
        {
            foreach (ITableHolder thRelazione in list)
            {
                long keyEaSX = SafeConvert.ToInt64(thRelazione.GetFieldContent(RELAZIONERR_BATCH.COD_KEY_EASX));
                long keyEaDX = SafeConvert.ToInt64(thRelazione.GetFieldContent(RELAZIONERR_BATCH.COD_KEY_EADX));
                long ruolo = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONERR_BATCH.COD_RUOL));

                EntitaBatch.EntitaBatch entitaSX = null;
                EntitaBatch.EntitaBatch entitaDX = null;
                bool entitaSxFound = false;
                bool entitaDxFound = false;
                foreach (EntitaBatch.EntitaBatch entita in _entitaBuffer)
                {
                    if (entita.Key == keyEaSX)
                    {
                        entitaSX = entita;
                        entitaSxFound = true;
                    }
                    if (entita.Key == keyEaDX)
                    {
                        entitaDX = entita;
                        entitaDxFound = true;
                    }
                    if (entitaSxFound && entitaDxFound)
                        break;
                }
                if (entitaDxFound && entitaSxFound)

                    if (entitaDX is UbicazioneBatch)
                    {
                        {
                            entitaSX.Ubicazione = entitaDX as UbicazioneBatch;
                        }
                        if (!entitaDxFound)
                        {
                            LogHelperWrapper.TraceDebugInfo(string.Format("Entita' dx {0} non trovata", keyEaDX));
                        }
                        if (!entitaSxFound)
                        {
                            LogHelperWrapper.TraceDebugInfo(string.Format("Entita' sx {0} non trovata", keyEaSX));
                        }
                    }
                    else
                    {
                        if (entitaDX is AeromobileBatch)
                        {
                            switch (ruolo)
                            {
                                default:
                                    break;
                            }
                        }
                    }
            }
        }

        private void ApplyRelazioniGR(IList<ITableHolder> listTh)
        {
            foreach (ITableHolder thRelazione in listTh)
            {
                long keyEaSX = SafeConvert.ToInt64(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_KEY_EASX));
                long keyEaDX = SafeConvert.ToInt64(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_KEY_EADX));
                long tipoLegame = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_TIPL_LEGA));
                int codLegame = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_LEGAME));

                foreach (IEntitaRV entitaGruppo in _entitaBuffer)
                {
                    if (entitaGruppo.Tipo == TabSys.Interfaces.Enums.TipiRischio.NucleoPersone)

                        if (entitaGruppo.Key == keyEaSX)
                        {
                            foreach (IEntitaRV entita in _entitaBuffer)
                            {
                                PersonaBatch aderente = entita as PersonaBatch;
                                if (aderente != null && aderente.Key == keyEaDX)
                                {
                                    aderente.SetLegame(codLegame);
                                    (entitaGruppo as NucleoFamiliareBatch).ComponentiNucleo.Add(aderente);
                                }

                            }

                        }
                }
            }
        }

        private void ApplyRelazioniRRAero(IList<ITableHolder> listTh)
        {
            foreach (ITableHolder thRelazione in listTh)
            {
                long keyEaSX = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_KEY_EASX));
                long keyEaDX = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_KEY_EADX));
                long tipoLegame = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_TIPL_LEGA));
                int codLegame = SafeConvert.ToInt(thRelazione.GetFieldContent(RELAZIONEGR_BATCH.COD_LEGAME));


                foreach (IEntitaRV entitaGruppo in _entitaBuffer)
                {
                    if (entitaGruppo.Tipo == TabSys.Interfaces.Enums.TipiRischio.NucleoPersone)

                        if (entitaGruppo.Key == keyEaSX)
                        {
                            foreach (IEntitaRV entita in _entitaBuffer)
                            {
                                PersonaBatch aderente = entita as PersonaBatch;
                                if (aderente != null && aderente.Key == keyEaDX)
                                {
                                    aderente.SetLegame(codLegame);
                                    (entitaGruppo as NucleoFamiliareBatch).ComponentiNucleo.Add(aderente);
                                }

                            }

                        }
                }
            }

        }
    }