/* EUROCORP — outil Docker Compose : générateur (compose + .env + commandes) et vérificateur.
   100 % local au navigateur, rien n'est envoyé nulle part. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- aléatoire --------------------------------------------------- */
  var AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function rnd(n) {
    var a = new Uint32Array(n), out = '';
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (var i = 0; i < n; i++) out += AL[a[i] % AL.length];
    return out;
  }
  function hex(n) {
    var a = new Uint8Array(n), out = '';
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (var i = 0; i < n; i++) out += ('0' + a[i].toString(16)).slice(-2);
    return out;
  }

  /* ---------- gabarits ---------------------------------------------------- */
  function zabbix(o) {
    var L = [
      'services:',
      '  postgres:',
      '    image: postgres:16-alpine',
      '    container_name: zabbix-postgres',
      '    restart: ' + o.restart,
      '    environment:',
      '      POSTGRES_DB: ${POSTGRES_DB}',
      '      POSTGRES_USER: ${POSTGRES_USER}',
      '      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}',
      '    volumes:',
      '      - pgdata:/var/lib/postgresql/data',
      '    networks:',
      '      - zabbix-backend',
      '',
      '  zabbix-server:',
      '    image: zabbix/zabbix-server-pgsql:' + o.tag,
      '    container_name: zabbix-server',
      '    restart: ' + o.restart,
      '    depends_on:',
      '      - postgres',
      '    environment:',
      '      DB_SERVER_HOST: postgres',
      '      POSTGRES_DB: ${POSTGRES_DB}',
      '      POSTGRES_USER: ${POSTGRES_USER}',
      '      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}',
      '    ports:',
      '      - "' + o.srvPort + ':10051"',
      '    networks:',
      '      - zabbix-backend',
      '      - zabbix-frontend',
      '',
      '  zabbix-web:',
      '    image: zabbix/zabbix-web-nginx-pgsql:' + o.tag,
      '    container_name: zabbix-web',
      '    restart: ' + o.restart,
      '    depends_on:',
      '      - postgres',
      '      - zabbix-server',
      '    environment:',
      '      ZBX_SERVER_HOST: zabbix-server',
      '      DB_SERVER_HOST: postgres',
      '      POSTGRES_DB: ${POSTGRES_DB}',
      '      POSTGRES_USER: ${POSTGRES_USER}',
      '      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}',
      '      PHP_TZ: ' + o.tz,
      '    ports:',
      '      - "' + o.webPort + ':8080"',
      '    networks:',
      '      - zabbix-backend',
      '      - zabbix-frontend'
    ];
    if (o.agent) {
      L = L.concat([
        '',
        '  # Agent de la VM Docker elle-même (hôte "Zabbix server", interface DNS zabbix-agent:10050)',
        '  zabbix-agent:',
        '    image: zabbix/zabbix-agent2:' + o.tag,
        '    container_name: zabbix-agent',
        '    hostname: zabbix-agent',
        '    restart: ' + o.restart,
        '    init: true',
        '    privileged: true',
        '    pid: host',
        '    depends_on:',
        '      - zabbix-server',
        '    environment:',
        '      ZBX_HOSTNAME: Zabbix server',
        '      ZBX_SERVER_HOST: zabbix-server',
        '    networks:',
        '      - zabbix-backend'
      ]);
    }
    L = L.concat(['', 'volumes:', '  pgdata:', '', 'networks:', '  zabbix-backend:', '    internal: true', '  zabbix-frontend:']);
    var env = ['# Zabbix — ' + o.dir + '/.env (lu automatiquement par docker compose ; chmod 600)',
      'POSTGRES_DB=' + o.db, 'POSTGRES_USER=' + o.user, 'POSTGRES_PASSWORD=' + o.pw];
    var cmd = ['sudo mkdir -p ' + o.dir + ' && cd ' + o.dir,
      '# créer docker-compose.yml et .env avec les contenus ci-dessus',
      'sudo chmod 600 .env',
      'sudo docker compose config -q && echo "compose valide"',
      'sudo docker compose up -d',
      'sudo docker compose ps',
      'sudo docker logs zabbix-server --tail 30',
      '# interface : http://<ip-ou-nom-de-la-VM>' + (o.webPort === '80' ? '' : ':' + o.webPort) + '  (compte initial documenté par Zabbix)'];
    if (o.agent) cmd.push('docker exec zabbix-server zabbix_get -s zabbix-agent -k agent.version   # doit renvoyer la version');
    return { compose: L.join('\n'), env: env.join('\n'), commands: cmd.join('\n'), extra: null };
  }

  function redmine(o) {
    var L = [
      'services:',
      '  db:',
      '    image: mariadb:' + o.dbTag,
      '    container_name: redmine-db',
      '    restart: ' + o.restart,
      '    environment:',
      '      MARIADB_DATABASE: ${MYSQL_DATABASE}',
      '      MARIADB_USER: ${MYSQL_USER}',
      '      MARIADB_PASSWORD: ${MYSQL_PASSWORD}',
      '      MARIADB_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}',
      '    volumes:',
      '      - redmine-db-data:/var/lib/mysql',
      '    networks:',
      '      - redmine-network',
      '',
      '  redmine:',
      '    image: redmine:' + o.tag,
      '    container_name: redmine-app',
      '    restart: ' + o.restart,
      '    depends_on:',
      '      - db'
    ];
    if (!o.https) L = L.concat(['    ports:', '      - "' + o.httpPort + ':3000"']);
    L = L.concat([
      '    environment:',
      '      REDMINE_DB_MYSQL: db',
      '      REDMINE_DB_DATABASE: ${MYSQL_DATABASE}',
      '      REDMINE_DB_USERNAME: ${MYSQL_USER}',
      '      REDMINE_DB_PASSWORD: ${MYSQL_PASSWORD}',
      '      SECRET_KEY_BASE: ${REDMINE_SECRET_KEY_BASE}',
      '    volumes:',
      '      - redmine-files:/usr/src/redmine/files',
      '    networks:',
      '      - redmine-network'
    ]);
    if (o.https) {
      L = L.concat([
        '',
        '  nginx:',
        '    image: nginx:alpine',
        '    container_name: redmine-nginx',
        '    restart: ' + o.restart,
        '    depends_on:',
        '      - redmine',
        '    ports:',
        '      - "' + o.httpPort + ':80"',
        '      - "' + o.httpsPort + ':443"',
        '    volumes:',
        '      - ./nginx/conf.d:/etc/nginx/conf.d:ro',
        '      - ./nginx/certs:/etc/nginx/certs:ro',
        '    networks:',
        '      - redmine-network'
      ]);
    }
    L = L.concat(['', 'volumes:', '  redmine-db-data:', '  redmine-files:', '', 'networks:', '  redmine-network:']);
    var env = ['# Redmine — ' + o.dir + '/.env (lu par docker compose et par backup-redmine.sh ; chmod 600)',
      'MYSQL_DATABASE=' + o.db, 'MYSQL_USER=' + o.user, 'MYSQL_PASSWORD=' + o.pw, 'MYSQL_ROOT_PASSWORD=' + o.pwRoot,
      'REDMINE_SECRET_KEY_BASE=' + o.secret];
    var cmd = ['sudo mkdir -p ' + o.dir + ' && cd ' + o.dir];
    var extra = null;
    if (o.https) {
      cmd.push('sudo mkdir -p nginx/conf.d nginx/certs',
        '# certificat auto-signé (labo) : clé puis certificat avec le nom et l\'IP du serveur',
        'sudo openssl genrsa -out nginx/certs/redmine.key 4096',
        'sudo openssl req -x509 -new -nodes -key nginx/certs/redmine.key -sha256 -days 365 -out nginx/certs/redmine.crt \\',
        '  -subj "/C=BE/O=LAB/OU=IT/CN=' + o.host + '" -addext "subjectAltName=DNS:' + o.host + ',IP:' + o.ip + '"',
        '# créer nginx/conf.d/redmine.conf avec le contenu « nginx » ci-dessus');
      extra = [
        'server {',
        '    listen 80;',
        '    server_name ' + o.host + ';',
        '    return 301 https://$host$request_uri;',
        '}',
        '',
        'server {',
        '    listen 443 ssl;',
        '    server_name ' + o.host + ';',
        '',
        '    ssl_certificate     /etc/nginx/certs/redmine.crt;',
        '    ssl_certificate_key /etc/nginx/certs/redmine.key;',
        '    ssl_protocols TLSv1.2 TLSv1.3;',
        '    client_max_body_size 100M;',
        '',
        '    location / {',
        '        proxy_pass http://redmine:3000;',
        '        proxy_http_version 1.1;',
        '        proxy_set_header Host $host;',
        '        proxy_set_header X-Real-IP $remote_addr;',
        '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;',
        '        proxy_set_header X-Forwarded-Proto https;',
        '    }',
        '}'
      ].join('\n');
    }
    cmd.push('# créer docker-compose.yml et .env avec les contenus ci-dessus',
      'sudo chmod 600 .env',
      'sudo docker compose config -q && echo "compose valide"',
      'sudo docker compose up -d',
      'sudo docker compose ps',
      'sudo docker logs redmine-app --tail 30',
      '# sauvegarde quotidienne (cron root) : 0 16 * * * ' + o.dir + '/backup/backup-redmine.sh >> ' + o.dir + '/backups/backup.log 2>&1');
    return { compose: L.join('\n'), env: env.join('\n'), commands: cmd.join('\n'), extra: extra };
  }

  /* ---------- interface du générateur ------------------------------------- */
  function field(id, label, value, hint, gen) {
    return '<div class="fld"><label for="' + id + '">' + label + '</label><div class="row"><input id="' + id + '" value="' + esc(value) + '" spellcheck="false" autocomplete="off">' +
      (gen ? '<button type="button" class="chip" data-gen="' + id + '" data-kind="' + gen + '">Générer</button>' : '') + '</div>' + (hint ? '<small>' + hint + '</small>' : '') + '</div>';
  }
  function select(id, label, opts, hint) {
    return '<div class="fld"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + opts.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>' + (hint ? '<small>' + hint + '</small>' : '') + '</div>';
  }
  function check(id, label, on) {
    return '<div class="fld"><label class="chk"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '> ' + label + '</label></div>';
  }
  var FORMS = {
    zabbix: function () {
      return field('dir', 'Dossier sur la VM', '/opt/zabbix-lab', 'Sur BRU-DOCKER01. Le compose et le .env vivent dans le même dossier.') +
        field('tag', 'Version des images Zabbix', 'alpine-7.4-latest', 'Même version que les agents installés sur les serveurs (notes : 7.4).') +
        field('webPort', 'Port publié de l\'interface', '80', 'Port de la VM → 8080 dans le conteneur web.') +
        field('srvPort', 'Port publié du serveur', '10051', 'Les agents (checks actifs) se connectent ici : à ouvrir dans la matrice de flux (F16).') +
        field('db', 'Nom de la base', 'zabbix') + field('user', 'Utilisateur de la base', 'zabbix') +
        field('pw', 'Mot de passe de la base', rnd(22), 'Une seule valeur, partagée par postgres, serveur et web.', 'pw') +
        check('agent', 'Ajouter l\'agent Zabbix 2 de la VM (service zabbix-agent)', true) +
        select('restart', 'Politique de redémarrage', ['unless-stopped', 'always', 'on-failure:3', 'no']) + field('tz', 'Fuseau PHP', 'Europe/Brussels');
    },
    redmine: function () {
      return field('dir', 'Dossier sur la VM', '/opt/redmine', 'Sur LON-DOCKER01. Le script de sauvegarde lit ce dossier (variable BASE_DIR).') +
        field('tag', 'Version de Redmine', '7.0.2') + field('dbTag', 'Version de MariaDB', '11') +
        check('https', 'HTTPS avec nginx (recommandé)', true) +
        field('host', 'Nom DNS du site', 'helpdesk.eurocorp.lan', 'Doit exister dans le DNS (CNAME vers lon-docker01).') +
        field('ip', 'IP du serveur (pour le certificat)', '172.17.30.40') +
        field('httpPort', 'Port HTTP publié', '80') + field('httpsPort', 'Port HTTPS publié', '443') +
        field('db', 'Nom de la base', 'redmine') + field('user', 'Utilisateur de la base', 'redmine') +
        field('pw', 'Mot de passe de la base', rnd(22), 'Partagé par db et redmine.', 'pw') +
        field('pwRoot', 'Mot de passe root MariaDB', rnd(22), 'Administration de la base uniquement.', 'pw') +
        field('secret', 'Clé secrète Redmine', hex(64), 'Signe sessions et cookies : longue et aléatoire.', 'hex') +
        select('restart', 'Politique de redémarrage', ['unless-stopped', 'always', 'on-failure:3', 'no']);
    }
  };

  function codeBlock(title, name, text) {
    return '<div class="code" data-file="' + esc(name) + '"><div class="cap"><span>' + esc(title) + '</span><span><button class="copy" type="button">Copier</button> ' +
      '<button class="copy dl" type="button">Télécharger</button></span></div><pre>' + esc(text) + '</pre></div>';
  }
  function val(id) { var e = document.getElementById(id); return e ? (e.type === 'checkbox' ? e.checked : e.value.trim()) : ''; }

  function initGenerator() {
    var box = $('#gen'); if (!box) return;
    var sel = $('#app'), form = $('#form'), out = $('#out');
    function build() {
      var app = sel.value, o = {};
      $$('input,select', form).forEach(function (el) { o[el.id] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
      var r = app === 'zabbix' ? zabbix(o) : redmine(o);
      out.innerHTML = codeBlock('docker-compose.yml', 'docker-compose.yml', r.compose) + codeBlock('.env', '.env', r.env) +
        (r.extra ? codeBlock('nginx/conf.d/redmine.conf', 'redmine.conf', r.extra) : '') + codeBlock('Commandes à lancer sur la VM', 'commandes.sh', r.commands);
      wireCode(out);
    }
    function draw() { form.innerHTML = FORMS[sel.value](); build(); }
    sel.addEventListener('change', draw);
    form.addEventListener('input', build);
    form.addEventListener('change', build);
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-gen]'); if (!b) return;
      document.getElementById(b.getAttribute('data-gen')).value = b.getAttribute('data-kind') === 'hex' ? hex(64) : rnd(22);
      build();
    });
    draw();
  }

  function wireCode(root) {
    $$('.code', root).forEach(function (c) {
      var btns = $$('.copy', c), pre = $('pre', c);
      btns[0].addEventListener('click', function () {
        var done = function () { btns[0].textContent = 'Copié'; setTimeout(function () { btns[0].textContent = 'Copier'; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(pre.innerText).then(done, function () { });
      });
      if (btns[1]) btns[1].addEventListener('click', function () {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([pre.innerText + '\n'], { type: 'text/plain' }));
        a.download = c.getAttribute('data-file') || 'fichier.txt';
        document.body.appendChild(a); a.click(); a.remove();
      });
    });
  }

  /* ---------- vérificateur ------------------------------------------------- */
  function parseEnv(txt) {
    var keys = {}, problems = [];
    txt.split(/\r?\n/).forEach(function (l, i) {
      if (!l.trim() || /^\s*#/.test(l)) return;
      var m = l.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m) { problems.push({ n: i + 1, l: l }); return; }
      keys[m[1]] = m[2];
    });
    return { keys: keys, bad: problems };
  }
  function parseCompose(txt) {
    var lines = txt.split(/\r?\n/), top = null, svcs = [], cur = null, volumes = {}, networks = {};
    lines.forEach(function (line) {
      if (!line.trim() || /^\s*#/.test(line)) return;
      var t = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
      if (t) { top = t[1]; cur = null; return; }
      if (top === 'services') {
        var m = line.match(/^  ([A-Za-z0-9_.-]+):\s*$/);
        if (m) { cur = { name: m[1], lines: [], sec: {} , key: null }; svcs.push(cur); return; }
        if (cur) {
          cur.lines.push(line);
          var k = line.match(/^    ([A-Za-z_]+):\s*(.*)$/);
          if (k) { cur.key = k[1]; cur.sec[cur.key] = cur.sec[cur.key] || []; if (k[2]) cur.sec[cur.key].push(k[2]); return; }
          if (cur.key) cur.sec[cur.key].push(line.trim().replace(/^-\s*/, ''));
        }
      } else if (top === 'volumes' || top === 'networks') {
        var d = line.match(/^  ([A-Za-z0-9_.-]+):/);
        if (d) (top === 'volumes' ? volumes : networks)[d[1]] = true;
      }
    });
    return { svcs: svcs, volumes: volumes, networks: networks };
  }
  function verify(composeTxt, envTxt) {
    var res = [], ok = function (m) { res.push(['ok', m]); }, warn = function (m) { res.push(['wn', m]); }, bad = function (m) { res.push(['no', m]); };
    if (!composeTxt.trim()) { bad('Colle d\'abord un docker-compose.yml.'); return res; }
    var env = parseEnv(envTxt), c = parseCompose(composeTxt);
    if (!c.svcs.length) { bad('Aucun service trouvé sous « services: » (indentation de 2 espaces attendue).'); return res; }
    ok(c.svcs.length + ' service(s) : ' + c.svcs.map(function (s) { return s.name; }).join(', '));

    /* variables */
    var used = {}, re = /\$\{([A-Za-z_][A-Za-z0-9_]*)(:?[-?][^}]*)?\}/g, m;
    while ((m = re.exec(composeTxt))) { if (!m[2]) used[m[1]] = true; else used[m[1] + '#d'] = true; }
    var miss = Object.keys(used).filter(function (k) { return k.indexOf('#') < 0 && !(k in env.keys); });
    if (miss.length) bad('Variable(s) utilisée(s) dans le compose mais absente(s) du .env : ' + miss.join(', ') + ' (docker compose les remplacera par une chaîne vide).');
    else if (Object.keys(used).length) ok('Toutes les variables ${…} du compose existent dans le .env.');
    var unused = Object.keys(env.keys).filter(function (k) { return !used[k] && !used[k + '#d']; });
    if (unused.length) warn('Présente(s) dans le .env mais jamais utilisée(s) par le compose : ' + unused.join(', ') + ' (normal si un script les lit, comme backup-redmine.sh).');
    env.bad.forEach(function (p) { bad('.env ligne ' + p.n + ' : « ' + p.l.trim() + ' » n\'est pas de la forme CLE=valeur (pas d\'espace autour du « = »).'); });
    Object.keys(env.keys).forEach(function (k) {
      var v = env.keys[k];
      if (v === '') warn('.env : ' + k + ' est vide.');
      if (/CHANGE_?ME|changeme|password$/i.test(v)) warn('.env : ' + k + ' contient encore une valeur d\'exemple.');
      if (/PASSWORD|SECRET|KEY|TOKEN/i.test(k) && v && v.length < 12) warn('.env : ' + k + ' fait moins de 12 caractères.');
      if (/\s#/.test(v)) warn('.env : ' + k + ' contient « # » précédé d\'un espace : tout ce qui suit est lu comme un commentaire.');
      if (/\$/.test(v)) warn('.env : ' + k + ' contient « $ » : il peut être interprété (écrire $$ pour un « $ » littéral).');
    });

    /* services */
    var hostPorts = {};
    c.svcs.forEach(function (s) {
      var p = s.name + ' : ';
      if (!s.sec.image && !s.sec.build) bad(p + 'ni image ni build.');
      var img = (s.sec.image || [''])[0];
      if (img && (!/:/.test(img.replace(/^[^/]*\//, '')) || /:latest$/.test(img))) warn(p + 'image « ' + img + ' » sans version fixe : un docker compose pull peut changer la version sans prévenir.');
      if (!s.sec.restart) warn(p + 'pas de « restart: » (par défaut « no » : le conteneur ne repart pas après un redémarrage de la VM).');
      (s.sec.environment || []).forEach(function (e) {
        var kv = e.match(/^([A-Za-z0-9_]+)\s*[:=]\s*(.+)$/);
        if (kv && /PASSWORD|SECRET|TOKEN|API_KEY/i.test(kv[1]) && !/^\$\{/.test(kv[2].replace(/^["']/, ''))) bad(p + kv[1] + ' est écrit en clair dans le compose : le mettre dans le .env et écrire ${' + kv[1] + '}.');
      });
      (s.sec.ports || []).forEach(function (pt) {
        var q = pt.replace(/["']/g, '').match(/^(?:([0-9.]+):)?(\d+):(\d+)/);
        if (q) { var key = (q[1] || '0.0.0.0') + ':' + q[2]; if (hostPorts[key]) bad('Port hôte ' + q[2] + ' publié par ' + hostPorts[key] + ' et par ' + s.name + '.'); hostPorts[key] = s.name; }
      });
      (s.sec.volumes || []).forEach(function (v) {
        var q = v.replace(/["']/g, '').match(/^([^:\s]+):/);
        if (q && !/^[./~]/.test(q[1]) && !c.volumes[q[1]]) bad(p + 'volume nommé « ' + q[1] + ' » utilisé mais non déclaré sous « volumes: » en bas du fichier.');
      });
      if (!(s.sec.volumes || []).length && /postgres|mariadb|mysql|mongo|redis|indexer|opensearch/i.test(img)) warn(p + 'une base de données sans volume : les données disparaîtront avec le conteneur.');
      (s.sec.networks || []).forEach(function (n) { if (!c.networks[n]) warn(p + 'réseau « ' + n + ' » non déclaré sous « networks: » (ignorer pour « default »).'); });
      if ((s.sec.privileged || [])[0] === 'true') warn(p + 'privileged: true — accès quasi total à l\'hôte, justifié seulement pour un agent de supervision.');
    });
    var withDeps = c.svcs.filter(function (s) { return s.sec.depends_on; });
    if (withDeps.length) warn('depends_on fixe l\'ordre de démarrage mais n\'attend pas que la base soit prête : si un service redémarre en boucle au premier lancement, relire ses logs (docker logs).');
    if (!res.some(function (r) { return r[0] === 'no'; })) ok('Aucune erreur bloquante détectée par ce contrôle simple.');
    return res;
  }
  function initVerifier() {
    var b = $('#verif'); if (!b) return;
    b.addEventListener('click', function () {
      var r = verify($('#vc').value, $('#ve').value);
      var lab = { ok: ['b-fait', 'OK'], wn: ['b-encours', 'À voir'], no: ['b-afaire', 'Erreur'] };
      $('#vr').innerHTML = '<ul class="chk-list">' + r.map(function (x) {
        return '<li><span class="badge ' + (x[0] === 'no' ? 'b-no' : lab[x[0]][0]) + '">' + lab[x[0]][1] + '</span> ' + esc(x[1]) + '</li>';
      }).join('') + '</ul><p class="src">Contrôle de texte, pas un validateur YAML : <code>docker compose config -q</code> sur la VM fait foi.</p>';
    });
    var ex = $('#vex');
    if (ex) ex.addEventListener('click', function () {
      $('#vc').value = 'services:\n  db:\n    image: mariadb:latest\n    environment:\n      MARIADB_PASSWORD: secret123\n      MARIADB_USER: ${DB_USER}\n    volumes:\n      - dbdata:/var/lib/mysql\n  app:\n    image: monapp:1.0\n    restart: unless-stopped\n    ports:\n      - "80:3000"\n  web:\n    image: nginx:1.27\n    ports:\n      - "80:80"\n';
      $('#ve').value = 'DB_USER=lab\nDB_PASSWORD = trop court\nINUTILE=1\n';
      b.click();
    });
  }

  document.addEventListener('DOMContentLoaded', function () { initGenerator(); initVerifier(); });
})();
