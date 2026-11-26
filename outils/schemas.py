# Générateur des schémas du lot 30 (outil de travail, pas une étape de build) : python3 outils/schemas.py sortie.json, puis coller les <figure> dans les pages.
from html import escape as e
W=400
class S:
    def __init__(s, sid, h, titre, desc, legende):
        s.sid, s.h, s.titre, s.desc, s.leg, s.o = sid, h, titre, desc, legende, []
    def add(s, x): s.o.append(x)
    def boite(s, x, y, w, h, titre, sous=None, cls="", code=None, sous2=None):
        s.add(f'<rect class="s-boite {cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8"/>')
        cx=x+w/2; lignes=[(titre,"s-titre")]+([(sous,"s-sous")] if sous else [])+([(sous2,"s-sous")] if sous2 else [])+([(code,"s-code")] if code else [])
        n=len(lignes); y0=y+h/2-(n-1)*9+5
        for i,(t,c) in enumerate(lignes):
            s.add(f'<text class="{c}" x="{cx}" y="{y0+i*18}" text-anchor="middle">{e(t)}</text>')
    def fleche(s, d, cls="", fin=True):
        m=f' marker-end="url(#{s.sid}-p)"' if fin else ''
        s.add(f'<path class="s-trait {cls}" d="{d}"{m}/>')
    def texte(s, x, y, t, cls="s-sous", anchor="middle"):
        s.add(f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">{e(t)}</text>')
    def num(s, x, y, n):
        s.add(f'<circle class="s-num" cx="{x}" cy="{y}" r="12"/><text class="s-num-t" x="{x}" y="{y+4.5}" text-anchor="middle">{n}</text>')
    def rendu(s):
        t,d=f"{s.sid}-t",f"{s.sid}-d"
        defs=(f'<defs><marker id="{s.sid}-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
              f'<path class="s-pointe" d="M0 0L10 5L0 10z"/></marker>'
              f'<pattern id="{s.sid}-h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="s-hachure" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>')
        body="\n".join(s.o).replace("url(#H)",f"url(#{s.sid}-h)")
        return (f'<figure class="schema" id="fig-{s.sid}">\n<svg viewBox="0 0 {W} {s.h}" role="img" aria-labelledby="{t} {d}">'
                f'<title id="{t}">{e(s.titre)}</title><desc id="{d}">{e(s.desc)}</desc>{defs}\n{body}\n</svg>\n'
                f'<figcaption><span class="fig-n">Fig.</span> {s.leg}</figcaption>\n</figure>\n')
F={}
# 1. J1 cycle de vie
s=S("cycle-ticket",430,"Cycle de vie d'un ticket","Ouvert ou à trier, puis en cours. Depuis En cours, le ticket peut passer en attente du client ou en attente d'un tiers, puis revenir en cours. Ensuite résolu, puis fermé ; un ticket résolu revient en cours si l'utilisateur répond que ça ne marche toujours pas.","Le cycle de vie d'un ticket (schéma d'exercice) : les attentes reviennent à « En cours », et « Résolu » n'est pas « Fermé ».")
s.boite(100,16,200,46,"Ouvert / À trier","le ticket vient d'arriver")
s.fleche("M200 62V92")
s.boite(100,94,200,46,"En cours","un agent l'a pris",cls="accent")
s.boite(8,186,176,54,"En attente du client","info ou test demandé")
s.boite(216,186,176,54,"En attente d'un tiers","escaladé")
s.fleche("M150 140C120 160 96 166 96 184")
s.fleche("M250 140C280 160 304 166 304 184")
s.fleche("M60 186C60 150 80 124 98 120","s-retour")
s.fleche("M340 186C340 150 320 124 302 120","s-retour")
s.fleche("M200 140V272")
s.boite(70,274,260,46,"Résolu","solution en place, utilisateur prévenu",cls="vert")
s.fleche("M200 320V350")
s.boite(100,352,200,46,"Fermé","après confirmation ou délai",cls="sombre")
s.fleche("M330 297C370 297 380 230 380 170C380 150 366 132 302 126","s-retour")
s.texte(396,412,"« ça ne marche toujours pas » : retour en cours","s-etiq","end")
F["cycle"]=s.rendu()
# 2. J5 du plus proche au plus lointain
st=[("Le poste","ping 127.0.0.1"),("Sa configuration","ipconfig /all"),("La passerelle","ping de la passerelle"),("Une adresse publique","ping d'une adresse IP"),("La résolution de noms","nslookup www.example.org"),("Le chemin","tracert")]
s=S("proche-lointain",30+len(st)*62+24,"Dépanner du plus proche au plus lointain","Six étapes dans l'ordre : le poste, sa configuration, la passerelle, une adresse publique, la résolution de noms, le chemin. Le premier échec oriente la recherche : c'est un indice, pas une preuve.","Du plus proche au plus lointain : le premier échec oriente la recherche (un indice, pas une preuve).")
s.texte(8,18,"Le plus proche","s-etiq","start")
for i,(a,b) in enumerate(st):
    y=30+i*62
    s.num(26,y+26,i+1)
    s.boite(48,y,344,52,a,code=b,cls="accent" if i==0 else "")
    if i<len(st)-1: s.fleche(f"M26 {y+38}V{y+74}","s-fin",fin=False)
s.texte(8,30+len(st)*62+16,"Le plus lointain","s-etiq","start")
F["proche"]=s.rendu()
# 3. J5 DORA
s=S("dora",370,"Les quatre messages du DHCP","Le poste diffuse Discover ; le serveur DHCP répond Offer avec une adresse ; le poste envoie Request pour cette adresse ; le serveur confirme par Acknowledge et fixe la durée du bail.","La poignée de main du DHCP en quatre temps (Discover, Offer, Request, Acknowledge).")
s.boite(16,12,150,44,"Le poste","sans adresse",cls="accent"); s.boite(234,12,150,44,"Serveur DHCP",cls="sombre")
s.add('<path class="s-vie" d="M91 56V360M309 56V360"/>')
msgs=[("Discover","« Y a-t-il un serveur DHCP ? »",1,"diffusion"),("Offer","« Je propose cette adresse »",-1,""),("Request","« Je la demande »",1,""),("Acknowledge","« Confirmé, et voici le bail »",-1,"")]
for i,(m,c,sens,x) in enumerate(msgs):
    y=96+i*72
    d=f"M95 {y}H305" if sens>0 else f"M305 {y}H95"
    s.fleche(d,"s-msg")
    s.texte(200,y-10,m,"s-titre"); s.texte(200,y+20,c,"s-sous")
    if x: s.texte(200,y+36,x,"s-etiq")
F["dora"]=s.rendu()
# 4. J6 annuaire
s=S("annuaire",360,"Rangement, droits et paramètres dans l'annuaire","Le domaine contient des OU : une OU de comptes et une OU d'ordinateurs. Un groupe donne des droits sur un dossier. Une GPO liée à l'OU des ordinateurs leur applique des paramètres d'ordinateur, comme le pare-feu. L'appartenance à une OU et à un groupe sont indépendantes.","Rangement = OU, droits = groupes, paramètres = GPO.")
s.boite(110,12,180,46,"Domaine","l'annuaire AD DS",cls="sombre")
s.fleche("M160 58C150 78 110 78 104 96"); s.fleche("M240 58C250 78 290 78 296 96")
s.boite(14,98,180,52,"OU « Personnel »","rangement des comptes")
s.boite(206,98,180,52,"OU « Salles »","rangement des ordinateurs")
s.boite(14,194,180,52,"Groupe","rassemble des comptes",cls="accent")
s.fleche("M104 150V192")
s.boite(14,290,180,52,"Dossier partagé","droits donnés au groupe",cls="hache")
s.fleche("M104 246V288")
s.boite(206,194,180,52,"GPO liée à l'OU","pare-feu, sécurité…",cls="accent")
s.fleche("M296 194V152","s-retour")
s.texte(300,280,"paramètres appliqués","s-etiq"); s.texte(300,296,"aux ordinateurs de l'OU","s-etiq")
s.texte(110,276,"droits","s-etiq","start"); s.texte(110,180,"comptes membres","s-etiq","start")
F["annuaire"]=s.rendu()
# 5. J8 sept étapes
st=[("Décrire","le symptôme, avec ses mots"),("Cadrer","depuis quand, qui est touché"),("Reproduire","noter l'heure et le message"),("Formuler une hypothèse","du plus simple au plus rare"),("Tester une seule chose","et noter le résultat"),("Résoudre ou contourner","puis faire confirmer"),("Documenter","cause, solution, fiche")]
s=S("sept-etapes",24+len(st)*56+10,"La méthode de diagnostic en sept étapes","Décrire, cadrer, reproduire, formuler une hypothèse, tester une seule chose à la fois, résoudre ou contourner, documenter. Si le test n'est pas concluant, on revient à une nouvelle hypothèse, ou on escalade.","Les sept étapes : une hypothèse, un test à la fois ; un test non concluant ramène à une nouvelle hypothèse, ou à l'escalade.")
for i,(a,b) in enumerate(st):
    y=16+i*56
    s.num(26,y+24,i+1)
    s.boite(48,y,280,48,a,b,cls="accent" if i in (3,4) else "")
    if i<len(st)-1: s.fleche(f"M26 {y+36}V{y+68}","s-fin",fin=False)
s.fleche("M328 264C372 256 372 196 330 190","s-retour")
s.texte(386,224,"non","s-etiq","end")
s.texte(386,238,"concluant","s-etiq","end")
F["sept"]=s.rendu()
# 6. Support Windows chaîne de démarrage
st=[("1. Alimentation","aucune LED, aucun ventilateur"),("2. Firmware et POST","ventilateurs, mais ni image ni logo"),("3. Disque de démarrage","« aucun périphérique de démarrage »"),("4. Chargement de Windows","boucle, réparation, écran bleu"),("5. Ouverture de session","profil temporaire, écran noir")]
s=S("demarrage",20+len(st)*70+8,"La chaîne de démarrage","Cinq maillons : alimentation, firmware et POST, recherche du disque de démarrage, chargement de Windows, ouverture de session. Chaque maillon a son symptôme quand il échoue.","Chaque maillon passe la main au suivant ; les symptômes (écran et câble vérifiés) sont des repères d'orientation.")
for i,(a,b) in enumerate(st):
    y=14+i*70
    s.boite(30,y,340,52,a,"si ça échoue : "+b,cls="sombre" if i==0 else ("accent" if i==2 else ""))
    if i<len(st)-1: s.fleche(f"M200 {y+52}V{y+68}")
F["demarrage"]=s.rendu()
# 7. Réseau de base couches
st=[("Application","HTTP/HTTPS, DNS, SMB, SMTP, RDP"),("Transport","TCP, UDP (ports)"),("Internet","IPv4, IPv6, ICMP"),("Liaison (accès réseau)","Ethernet, Wi-Fi, VLAN")]
s=S("couches",28+len(st)*64+6,"Les quatre étages du modèle TCP/IP","De haut en bas : application, transport, internet, liaison (accès réseau). Le dépannage remonte du bas vers le haut.","Les quatre étages TCP/IP ; on dépanne du bas vers le haut.")
for i,(a,b) in enumerate(st):
    y=20+i*64
    s.boite(64,y,328,54,a,b,cls="hache" if i==3 else "")
s.fleche(f"M30 {20+len(st)*64-12}V28","s-fort")
s.add(f'<text class="s-etiq" transform="translate(20 {20+len(st)*32}) rotate(-90)" text-anchor="middle">dépannage du bas vers le haut</text>')
F["couches"]=s.rendu()
# 8. Sous-réseaux /24 en 4 x /26
s=S("decoupage",300,"Un /24 découpé en quatre /26","Le réseau 192.168.123.0/24 découpé avec le masque 255.255.255.192 donne quatre sous-réseaux : .0, .64, .128 et .192, avec les plages d'hôtes .1 à .62, .65 à .126, .129 à .190 et .193 à .254.","L'exemple de Microsoft : 192.168.123.0/24 en quatre /26 de 62 hôtes.")
s.boite(8,10,384,44,"192.168.123.0/24","256 adresses",cls="sombre")
for i in range(4):
    x=8+(i%2)*196; y=86+(i//2)*86; base=i*64
    s.boite(x,y,188,72,f"192.168.123.{base}/26",f"hôtes .{base+1} à .{base+62}",cls="accent" if i==0 else "",sous2=f"diffusion .{base+63}")
s.fleche("M102 54V84"); s.fleche("M298 54V84")
s.texte(200,272,"masque 255.255.255.192 · pas de 64","s-etiq")
s.texte(200,290,"62 hôtes utilisables par sous-réseau","s-etiq")
F["decoupage"]=s.rendu()
# 9. AGDLP
st=[("A — Comptes","les utilisateurs"),("G — Groupe global","par fonction : « Enseignants »"),("DL — Groupe de domaine local","attaché à une ressource : « Partage-Compta-Lecture »"),("P — Permission","posée sur la ressource, pour le groupe DL")]
s=S("agdlp",20+len(st)*72,"Le modèle AGDLP (une convention)","Les comptes vont dans des groupes globaux par fonction, qui vont dans des groupes de domaine local attachés à une ressource, sur laquelle on pose la permission.","AGDLP, une convention d'organisation : les droits vont à un groupe, pas à des personnes, comme le recommande Microsoft.")
for i,(a,b) in enumerate(st):
    y=12+i*72
    s.boite(20,y,360,54,a,b,cls="accent" if i==3 else "")
    if i<len(st)-1: s.fleche(f"M200 {y+54}V{y+70}")
F["agdlp"]=s.rendu()
# 10. ITIL incident probleme erreur connue
s=S("probleme",400,"Des incidents au problème, puis à l'erreur connue","Un ou plusieurs incidents ont une cause : un problème, cause réelle ou potentielle. Le problème analysé mais pas encore résolu devient une erreur connue, documentée avec son contournement s'il existe, pour que le N1 puisse le proposer.","Incident : rétablir vite. Problème : chercher la cause. Erreur connue : analysée, pas encore résolue.")
for i in range(3):
    s.boite(14+i*126,12,120,44,"Incident",f"appel {i+1}")
    s.fleche(f"M{74+i*126} 56C{74+i*126} 80 200 80 200 100")
s.boite(80,102,240,54,"Problème","cause réelle ou potentielle",cls="accent")
s.fleche("M200 156V190")
s.boite(80,192,240,62,"Erreur connue","analysée, pas encore résolue",sous2="contournement noté s'il existe",cls="hache")
s.fleche("M200 254V288")
s.boite(80,290,240,54,"Base de connaissances","le N1 propose le contournement",cls="sombre")
s.texte(200,380,"la correction, si elle est prévue, viendra plus tard","s-etiq")
F["probleme"]=s.rendu()
# 11. M365 boîte partagée
s=S("boite-partagee",360,"Les droits d'une boîte partagée","Accès total : ouvrir la boîte et gérer son contenu, sans droit d'envoi. Envoyer en tant que : le message semble venir de la boîte. Envoyer de la part de : le destinataire voit le nom de la personne de la part de la boîte.","Voir n'est pas envoyer : trois droits distincts.")
s.boite(110,12,180,50,"Boîte partagée","« Secrétariat »",cls="sombre")
rows=[("Accès total","Full Access","ouvrir, lire, gérer — pas d'envoi"),("Envoyer en tant que","Send As","le message vient « de la boîte »"),("Envoyer de la part de","Send on Behalf","« X de la part de la boîte »")]
for i,(a,b,c) in enumerate(rows):
    y=100+i*86
    s.boite(30,y,340,66,a,c,code=b,cls="accent" if i==0 else "")
    s.fleche(f"M200 62V80H14V{y+33}H28")
F["boite"]=s.rendu()
# 12. Matériel compatibilité
s=S("compatibilite",380,"Les vérifications de compatibilité autour de la carte mère","Autour de la carte mère : le processeur (socket et liste de compatibilité), la mémoire (DDR4 ou DDR5, DIMM ou SO-DIMM), le stockage M.2 (NVMe ou SATA, longueur), le format (carte, boîtier, alimentation) et le graphique (intégré au processeur ou carte dédiée).","Avant d'acheter ou de poser une pièce : cinq vérifications dans les fiches de la carte mère et des pièces.")
s.boite(120,150,160,64,"Carte mère","sa fiche technique",cls="sombre")
pts=[(8,16,"Processeur","socket, liste de la carte"),(212,16,"Mémoire","DDR4 ou DDR5"),(8,280,"Stockage M.2","NVMe ou SATA, longueur"),(212,280,"Format","carte, boîtier, alimentation")]
for (x,y,a,b) in pts:
    s.boite(x,y,180,62,a,b,cls="accent",sous2=("DIMM ou SO-DIMM" if a=="Mémoire" else None))
s.fleche("M98 78C98 120 140 130 150 148","s-fin",fin=False); s.fleche("M302 78C302 120 260 130 250 148","s-fin",fin=False)
s.fleche("M98 278C98 240 140 230 150 216","s-fin",fin=False); s.fleche("M302 278C302 240 260 230 250 216","s-fin",fin=False)
s.boite(8,160,100,44,"Graphique","intégré ?",cls="hache"); s.fleche("M108 182H118","s-fin",fin=False)
F["compat"]=s.rendu()
import json,sys
json.dump(F,open(sys.argv[1],'w'),ensure_ascii=False)
print(len(F))
