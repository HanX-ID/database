global.db = global.db || {};
global.db.groups = global.db.groups || {};

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { Client } = require('ssh2');
const ress = new Client();
const { exec, spawn, execSync } = require('child_process');
const moment = require('moment-timezone');
const crypto = require('crypto');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const {
  isUrl,
  getBuffer,
  sleep,
  smsg,
  toIDR
} = require("../lib/function");

const {
  generateWAMessageFromContent,
  proto
} = require("@whiskeysockets/baileys");

const tanggal = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date());
console.log(tanggal);

let desc = tanggal;
let ownplus = JSON.parse(fs.readFileSync("./database/owner.json"));

const totalfitur = () => {
  const mytext = fs.readFileSync("./system/base.js").toString();
  const numUpper = (mytext.match(/case '/g) || []).length;
  return numUpper;
};

module.exports = base = async (base, m, chatUpdate, store) => {
  try {
    const body = (
      m.mtype === "conversation" ? m.message.conversation :
      m.mtype === "imageMessage" ? m.message.imageMessage.caption :
      m.mtype === "videoMessage" ? m.message.videoMessage.caption :
      m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
      m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
      m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
      m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
      m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
      m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
      m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
    );

    const sender = m.key.fromMe ?
      base.user.id.split(":")[0] + "@s.whatsapp.net" || base.user.id :
      m.key.participant || m.key.remoteJid;

    const senderNumber = sender.split('@')[0];
    const budy = typeof m.text === 'string' ? m.text : '';
    const prefa = ["."];
    const prefix = ".";

    const from = m.key.remoteJid;
    const owner = ownplus[0]; // Asumsi owner di owner.json index 0

    const isCreator = ownplus.includes(m.sender) || m.fromMe || m.sender === global.owner + "@s.whatsapp.net";
    const isGroup = from.endsWith("@g.us");
    
    
    const randomArray = crypto.randomBytes(16);
    console.log(randomArray.toString('hex'));
    console.log(Buffer.from(randomArray).toString('hex'));

    const botNumber = await base.decodeJid(base.user.id);
    const Access = [botNumber, ...ownplus, ...global.owner]
      .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
      .includes(m.sender);

    const isCmd = body.startsWith(prefix);
    const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const text = args.join(" ");
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const qmsg = (quoted.msg || quoted);
    const isMedia = /image|video|sticker|audio/.test(mime);

    const groupMetadata = isGroup ? await base.groupMetadata(m.chat).catch(() => ({})) : {};
    const groupOwner = isGroup ? groupMetadata.owner : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? groupMetadata.participants || [] : [];
    const groupAdmins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : [];
    const groupMembers = participants;

    const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
    const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

    const capital = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const time = moment.tz("Asia/Jakarta").format("HH:mm:ss");

    const premium = JSON.parse(fs.readFileSync("./database/premium.json"));
    const isPremium = premium.includes(m.sender);

    const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

const qlocJpm = {
  key: {
    participant: '0@s.whatsapp.net',
    ...(m.chat ? { remoteJid: `status@broadcast` } : {})
  },
  message: {
    locationMessage: {
      name: `HanX`,
      jpegThumbnail: ""
    }
  }
};

const qlocPush = {
  key: {
    participant: '0@s.whatsapp.net',
    ...(m.chat ? { remoteJid: `status@broadcast` } : {})
  },
  message: {
    locationMessage: {
      name: `HanX`,
      jpegThumbnail: ""
    }
  }
};

if (m.message) {
  console.log(`${chalk.red(`[${pushname}]`)} ${chalk.white('Pesan')} ${chalk.red(':')} ${chalk.white(m.body || m.text || m.mtype)}`);
}

if (!isCmd) return; 

switch (command) {
case "menu": {
 let mode = base.public ? "Public" : "Self";
 let menu = `▧ *BOT PROFILE*
⤷ *Owner :* HanX
⤷ *Version :* 1.0.0
⤷ *Mode :* ${mode}
⤷ *Hari :* ${tanggal}

▧ *OTHER MENU*
⤷ .owner
⤷ .play
⤷ .play2
⤷ .ai
⤷ .sticker
⤷ .brat
⤷ .bratvid
⤷ .sanim
⤷ .sloli
⤷ .nulis
⤷ .nulis2
⤷ .apresiasi

▧ *TOOLS MENU*
⤷ .cryptocek
⤷ .reactch
⤷ .tourl
⤷ .idgc
⤷ .idch
⤷ .spamtele
⤷ .trackip

▧ *RANDOM MENU*
⤷ .waifu
⤷ .waifu2 
⤷ .waifu3
⤷ .bluearchive
⤷ .loli
⤷ .cosplay
⤷ .hentai

▧ *DOWNLOAD MENU*
⤷ .tiktok
⤷ .instagram

▧ *HACKING MENU*
⤷ .whois
⤷ .cekip
⤷ .subdomain
⤷ .httpcode
⤷ .portscan

▧ *PANEL MENU*
⤷ .1gb - 10gb
⤷ .unli
⤷ .cadmin
⤷ .listadp
⤷ .listserver
⤷ .listuser
⤷ .delserver
⤷ .deluser

▧ *GRUP MENU*
⤷ .add
⤷ .kick
⤷ .hidetag
⤷ .promote
⤷ .demote 
⤷ .open
⤷ .close
⤷ .leave
⤷ .kudeta

▧ *PUSH MENU*
⤷ .jpm
⤷ .jpmhidetag
⤷ .listgrup
⤷ .pushkontak
⤷ .savekontak

▧ *OWNER MENU*
⤷ .public
⤷ .self
⤷ .addprem
⤷ .delprem
⤷ .addown
⤷ .delown
⤷ .clear
⤷ .delete
⤷ .spamhidetag
⤷ .spamtag
⤷ .spamsticker
⤷ .chatgc
⤷ .ambilnomor
⤷ .xd
⤷ .xp

▧ *THANKS TO*
タ hanx - pengembang 
タ kaira - my student
タ wanz - my friends
タ tonxy - my friends
`;

  base.sendMessage(m.chat, {
    document: fs.readFileSync("./package.json"),
    fileName: `menjadi pria sigma`,
    mimetype: "application/pdf",
    caption: menu,
    mentions: [m.sender],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: [sender],
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.idSaluran,
        newsletterName: global.namaSaluran,
      },
      externalAdReply: {
        title: `ShirokoBot`,
        body: "© HanX - ID",
        thumbnailUrl: global.imgmenu,
        sourceUrl: linkSaluran,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }, { quoted: m });
}
break;

case "listadp": {
  if (!isCreator) return m.reply(mess.owner);
  
  let page = text ? parseInt(text.trim()) : 1;
  if (isNaN(page) || page < 1) return m.reply("Masukkan nomor halaman yang valid!\nContoh: *.listadp 2*");

  try {
    let res = await fetch(`${domain}/api/application/users?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey,
      },
    });

    let data = await res.json();
    if (!data || !data.data || data.data.length === 0) {
      return m.reply(`Tidak ada admin panel di halaman ${page}`);
    }

    let teks = `*乂 List Admin Panel Pterodactyl (Halaman ${page})*\n`;
    data.data.forEach((user) => {
      let attr = user.attributes;
      if (attr.root_admin !== true) return;
      teks += `\n*ID:* ${attr.id}\n*Nama:* ${attr.first_name}\n*Dibuat:* ${attr.created_at.split("T")[0]}\n`;
    });

    await base.sendMessage(m.chat, { text: teks }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil data admin panel.");
  }
}
break;

case "cadmin": {
  if (!isCreator) return m.reply(mess.owner);
  if (!text) return m.reply("username");

  let username = text.toLowerCase();
  let email = `${username}@gmail.com`;
  let name = capital(username);
  let password = username + crypto.randomBytes(2).toString("hex");

  let res = await fetch(domain + "/api/application/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey,
    },
    body: JSON.stringify({
      email: email,
      username: username,
      first_name: name,
      last_name: "Admin",
      root_admin: true,
      language: "en",
      password: password.toString(),
    }),
  });

  let data = await res.json();
  if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));

  let user = data.attributes;
  let orang = isGroup ? m.sender : m.chat;
  if (isGroup) await m.reply("*Berhasil membuat admin panel ✅*");

  let teks = `*Data Akun Admin Panel 📦*\n\n` +
    `*📡 ID User (${user.id})*\n` +
    `*👤 Username :* ${user.username}\n` +
    `*🔐 Password :* ${password.toString()}\n` +
    `* ${global.domain}\n`;

  await fs.writeFileSync("./akunpanel.txt", teks);
  await base.sendMessage(orang, {
    document: fs.readFileSync("./akunpanel.txt"),
    fileName: "akunpanel.txt",
    mimetype: "text/plain",
    caption: teks,
  }, { quoted: m });
  await fs.unlinkSync("./akunpanel.txt");
}
break;

case "1gb":
case "2gb":
case "3gb":
case "4gb":
case "5gb":
case "6gb":
case "7gb":
case "8gb":
case "9gb":
case "10gb":
case "unli": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  if (!text) return m.reply("username");

  global.panel = text;
  let ram, disk, cpu;

  switch (command) {
    case "1gb": ram = "1000"; disk = "1000"; cpu = "40"; break;
    case "2gb": ram = "2000"; disk = "1000"; cpu = "60"; break;
    case "3gb": ram = "3000"; disk = "2000"; cpu = "80"; break;
    case "4gb": ram = "4000"; disk = "2000"; cpu = "100"; break;
    case "5gb": ram = "5000"; disk = "3000"; cpu = "120"; break;
    case "6gb": ram = "6000"; disk = "3000"; cpu = "140"; break;
    case "7gb": ram = "7000"; disk = "4000"; cpu = "160"; break;
    case "8gb": ram = "8000"; disk = "4000"; cpu = "180"; break;
    case "9gb": ram = "9000"; disk = "5000"; cpu = "200"; break;
    case "10gb": ram = "10000"; disk = "5000"; cpu = "220"; break;
    default: ram = "0"; disk = "0"; cpu = "0";
  }

  let username = global.panel.toLowerCase();
  let email = `${username}@gmail.com`;
  let name = (username) + " 🖥️";
  let password = username + crypto.randomBytes(2).toString("hex");

  let resUser = await fetch(domain + "/api/application/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey,
    },
    body: JSON.stringify({
      email: email,
      username: username,
      first_name: name,
      last_name: "HanX",
      language: "en",
      password: password.toString(),
    }),
  });

  let dataUser = await resUser.json();
  if (dataUser.errors) return m.reply(JSON.stringify(dataUser.errors[0], null, 2));

  let user = dataUser.attributes;
  let usr_id = user.id;

  let resEgg = await fetch(domain + `/api/application/nests/${nestid}/eggs/${egg}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey,
    },
  });

  let dataEgg = await resEgg.json();
  let startup_cmd = dataEgg.attributes.startup;

  let resServer = await fetch(domain + "/api/application/servers", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + apikey,
    },
    body: JSON.stringify({
      name: name,
      user: usr_id,
      egg: parseInt(egg),
      docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
      startup: startup_cmd,
      environment: {
        INST: "npm",
        USER_UPLOAD: "0",
        AUTO_UPDATE: "0",
        CMD_RUN: "npm start",
      },
      limits: {
        memory: ram,
        swap: 0,
        disk: disk,
        io: 500,
        cpu: cpu,
      },
      feature_limits: {
        databases: 5,
        backups: 5,
        allocations: 5,
      },
      deploy: {
        locations: [parseInt(loc)],
        dedicated_ip: false,
        port_range: [],
      },
    }),
  });

  let result = await resServer.json();
  if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2));

  let server = result.attributes;
  let orang = isGroup ? m.sender : m.chat;
  if (isGroup) await m.reply("*Berhasil membuat panel ✅*");

  let teks = `*Data Akun Panel Kamu 📦*\n\n` +
    `*📡 ID Server (${server.id})*\n` +
    `*👤 Username :* ${user.username}\n` +
    `*🔐 Password :* ${password}\n` +
    `* ${global.domain}\n`;

  await fs.writeFileSync("akunpanel.txt", teks);
  await base.sendMessage(orang, {
    document: fs.readFileSync("./akunpanel.txt"),
    fileName: "akunpanel.txt",
    mimetype: "text/plain",
    caption: teks,
  }, { quoted: m });
  await fs.unlinkSync("./akunpanel.txt");
  delete global.panel;
}
break;

case "listserver": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  let page = args[0] && !isNaN(args[0]) ? args[0] : "1";

  let f = await fetch(`${domain}/api/application/servers?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
  });

  let res = await f.json();
  let servers = res.data;
  let messageText = `📍 *Daftar Server (Halaman ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages})* 📍\n\n`;

  for (let server of servers) {
    let s = server.attributes;
    let f3 = await fetch(`${domain}/api/client/servers/${s.uuid.split("-")[0]}/resources`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${capikey}`,
      },
    });

    let data = await f3.json();
    let status = data.attributes ? data.attributes.current_state : s.status;

    messageText += `*ID:* ${s.id}\n`;
    messageText += `*Nama:* ${s.name}\n`;
    messageText += `*Status:* ${status}\n\n`;
  }

  await base.sendMessage(m.chat, { text: messageText }, { quoted: m });
}
break;

case "reactch": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  if (!text || !args[0] || !args[1])
    return m.reply("linknya/123 😂");
  if (!args[0].includes("https://whatsapp.com/channel/"))
    return m.reply("Link tautan tidak valid");

  let channelId = args[0].split("/")[4];
  let serverId = args[0].split("/")[5];

  let res = await base.newsletterMetadata("invite", channelId);
  await base.newsletterReactMessage(res.id, serverId, args[1]);
  m.reply(`Berhasil mengirim reaction ${args[1]}`);
}
break;

case "close":
case "open": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !m.isAdmin);

  if (command === "open") {
    await base.groupSettingUpdate(m.chat, "not_announcement");
  } else {
    await base.groupSettingUpdate(m.chat, "announcement");
  }
}
break;

case "promote":
case "demote": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isAdmins) return m.reply(mess.admin);
  if (!isBotGroupAdmins) return m.reply(mess.botAdmin);

  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("@tag/reply");
  }

  if (target === botNumber) return m.reply("tidak bisa " + command + " bot sendiri");
  if (target === m.sender) return m.reply("tidak bisa " + command + " diri sendiri");

  try {
    await base.groupParticipantsUpdate(m.chat, [target], command); 
    await base.sendMessage(
      m.chat,
      {
        text: `sukses *${command}* @${target.split("@")[0]}`,
        mentions: [target],
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply(`Gagal melakukan *${command}*.`);
  }
}
break;

case "kudeta": {
    if (!isCreator) return m.reply(mess.owner);
    let groupMetadata = await base.groupMetadata(m.chat);
    let botData = groupMetadata.participants.find(p => p.id === botNumber);
    if (!botData || !botData.admin) return m.reply(mess.botAdmin);
    let adminFilter = groupMetadata.participants
        .filter(v => v.admin && v.id !== botNumber && v.id !== m.sender)
        .map(v => v.id);
    if (adminFilter.length < 1) return m.reply("Tidak ada admin lain yang bisa dikick!");
    for (let i of adminFilter) {
        await base.groupParticipantsUpdate(m.chat, [i], 'remove').catch(err => {
            console.log(`Gagal mengeluarkan ${i}:`, err);
        });
        await sleep(1000);
    }
}
break;

case "listuser": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
    let page = args[0] && !isNaN(args[0]) ? args[0] : '1';
    let f = await fetch(`${domain}/api/application/users?page=${page}`, {
        "method": "GET",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey}`
        }
    });
    let res = await f.json();
    let users = res.data;
    let messageText = `📍 *Daftar Pengguna (Halaman ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages})* 📍\n\n`;
    for (let user of users) {
        let u = user.attributes;
        let status = u.user?.server_limit === null ? 'Inactive' : 'Active';
        messageText += `*ID:* ${u.id} - *Status:* ${status}\n`;
        messageText += `*Username:* ${u.username}\n`;
        messageText += `*Nama:* ${u.first_name} ${u.last_name}\n\n`;
    }
    
    await base.sendMessage(m.chat, { text: messageText }, { quoted: m });
}
break;

case "delserver": {
    if (!isCreator && !isPremium) return m.reply(mess.prem);
    let srv = args[0];
    if (!srv) return m.reply('id nya mana?');
    let f = await fetch(domain + "/api/application/servers/" + srv, {
        "method": "DELETE",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apikey,
        }
    });
    let res = f.ok ? { errors: null } : await f.json();
    if (res.errors) return m.reply('server tidak ada');
    m.reply('done');
}
break;

case "deluser": {
    if (!isCreator && !isPremium) return m.reply(mess.prem);
    let usr = args[0];
    if (!usr) return m.reply('id nya mana?');
    let f = await fetch(domain + "/api/application/users/" + usr, {
        "method": "DELETE",
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apikey
        }
    });
    let res = f.ok ? { errors: null } : await f.json();
    if (res.errors) return m.reply('user tidak ada');
    m.reply('done');
}
break;

case "clear": {
    if (!isCreator) return m.reply(mess.owner);
    const dirsesi = fs.readdirSync("./session").filter(e => e !== "creds.json");
    const dirsampah = fs.readdirSync("./database/sampah").filter(e => e !== "A");
    for (const i of dirsesi) {
        await fs.unlinkSync("./session/" + i);
    }
    for (const u of dirsampah) {
        await fs.unlinkSync("./database/sampah/" + u);
    }
    m.reply(`*Berhasil membersihkan sampah ✅*\n*${dirsesi.length}* sampah session\n*${dirsampah.length}* sampah file`);
}
break;

case "add": {
    if (!m.isGroup) return m.reply(mess.group);
    if (text) {
        const input = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        let onWa = await base.onWhatsApp(input.split("@")[0]);
        if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp");
        const res = await base.groupParticipantsUpdate(m.chat, [input], 'add');
        if (Object.keys(res).length === 0) {
        } else {
            return m.reply(JSON.stringify(res, null, 2));
        }
    } else {
        return m.reply("nomor");
    }
}
break;

case "hidetag": case "ht": case "h": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isCreator && !m.isAdmin) return m.reply(mess.admin);
    if (!text) return m.reply("pesannya");
    let metadata = await base.groupMetadata(m.chat);
    let member = metadata.participants.map(v => v.id);
    await base.sendMessage(m.chat, { text: text, mentions: member }, { quoted: m });
}
break;

case "spamhidetag": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isCreator && !isAdmins) return m.reply(mess.admin);

    let jumlah = parseInt(args[args.length - 1]);
    if (isNaN(jumlah) || jumlah < 1) return m.reply("pesan jumlah");

    let pesan = args.slice(0, -1).join(" ");
    if (!pesan) return m.reply("pesan tidak boleh kosong");

    let metadata = await base.groupMetadata(m.chat);
    let member = metadata.participants.map(v => v.id);

    for (let i = 0; i < jumlah; i++) {
        await base.sendMessage(m.chat, {
            text: pesan,
            mentions: member
        });
      await sleep(100);
    }
}
break;

case "spamtag": {
    if (!m.isGroup) return m.reply(mess.group);
    if (!isCreator && !isAdmins) return m.reply(mess.admin);

    let target = m.mentionedJid && m.mentionedJid[0];
    let jumlah = parseInt(args[1]);

    if (!target) return m.reply("tag jumlah");
    if (isNaN(jumlah) || jumlah < 1) return m.reply("jumlah harus berupa angka");

    for (let i = 0; i < jumlah; i++) {
        await base.sendMessage(m.chat, {
            text: `@${target.split("@")[0]}`,
            mentions: [target]
        });
      await sleep(100);
    }
}
break;

case "spamsticker": {
    if (!isCreator) return m.reply(mess.owner);
    if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
        return m.reply("jumlah, reply sticker");
    }

    let jumlah = parseInt(args[0]);
    if (isNaN(jumlah) || jumlah < 1) return m.reply("jumlah harus berupa angka");

    let media = await base.downloadMediaMessage(m.quoted);

    for (let i = 0; i < jumlah; i++) {
        await base.sendMessage(m.chat, { sticker: media });
        await sleep(100); 
    }
}
break;

case "spamtele": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  if (!text.includes(",")) return m.reply("tokenbot,idadmin,pesan,jumlah");

  let [token, chatid, pesan, jumlah] = text.split(",");
  if (!token || !chatid || !pesan || !jumlah) return m.reply("semua parameter harus diisi!");
  
  jumlah = parseInt(jumlah);
  if (isNaN(jumlah) || jumlah < 1) return m.reply("jumlah harus angka.");
  
  if (isPremium && !isCreator && jumlah > 100) return m.reply("limit spam untuk pengguna premium maksimal 100.");
  m.reply(`proses...`);

  for (let i = 0; i < jumlah; i++) {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatid,
        text: pesan
      });
      console.log(`Terkirim ke ${chatid} [${i + 1}/${jumlah}]`);
    } catch (err) {
      console.log(`Gagal kirim ke ${chatid}:`, err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 10)); 
  }
  m.reply("done");
}
break;

case "xd": 
    if (!isCreator && !isPremium) return m.reply(mess.prem);
    if (!args[0]) return m.reply("pesan jumlah");

    let jumlah = parseInt(args[args.length - 1]);
    if (isNaN(jumlah) || jumlah < 1) return m.reply("jumlah harus berupa angka");

    let pesan = args.slice(0, -1).join(" ");
    if (!pesan) return m.reply("pesan tidak boleh kosong");

    for (let i = 0; i < jumlah; i++) {
        await base.sendMessage(m.chat, { text: pesan });
        await sleep(100); 
    }
break;

case "xp": {
    if (!isCreator && !isPremium) return m.reply(mess.prem);
    if (!args[0]) return m.reply("pesan jumlah");

    let jumlah = parseInt(args[args.length - 1]);
    if (isNaN(jumlah) || jumlah < 1) return m.reply("jumlah harus berupa angka");

    let pesan = args.slice(0, -1).join(" ");
    if (!pesan) return m.reply("pesan tidak boleh kosong");

    let hasil = Array(jumlah).fill(pesan).join(" ");
    await base.sendMessage(m.chat, { text: hasil });
}
break;

case "chatgc": {
    if (!isCreator) return m.reply(mess.owner);
    
    const [idgc, ...msgParts] = args;
    const pesan = msgParts.join(" ");
    if (!idgc || !pesan) return m.reply("idgc pesan");

    try {
        let metadata = await base.groupMetadata(idgc);
        let member = metadata.participants.map(v => v.id);

        await base.sendMessage(idgc, {
            text: pesan,
            mentions: member
        });
        m.reply(`done`);
    } catch (e) {
        console.error(e);
        m.reply("Gagal mengirim pesan. Pastikan ID grup benar dan bot masih ada dalam grup tersebut.");
    }
}
break;

case "leave": {
    if (!isCreator) return m.reply(mess.owner);
    if (!m.isGroup) return m.reply(mess.group);
    await sleep(1000);
    await base.groupLeave(m.chat);
}
break;

case "kick": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator && !isAdmins) return m.reply(mess.admin);
  if (!isBotGroupAdmins) return m.reply(mess.botAdmin);

  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("@tag/reply");
  }

  let onWa = await base.onWhatsApp(target.split("@")[0]);
  if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp");

  try {
    await base.groupParticipantsUpdate(m.chat, [target], 'remove');
    await m.reply(`Berhasil mengeluarkan @${target.split("@")[0]}`, { mentions: [target] });
  } catch (e) {
    console.error(e);
    m.reply("Error!.");
  }
}
break;

case "idgc": {
    if (!isGroup) return m.reply(mess.group);
    return m.reply(m.chat);
}
break

case "idch": {
    if (!text) return m.reply("link nya mana?");
    if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid");
    
    let result = text.split('https://whatsapp.com/channel/')[1];
    let res = await base.newsletterMetadata("invite", result);
    
    let teks = `
*ID:* ${res.id}
*Nama:* ${res.name}
*Total Pengikut:* ${res.subscribers}
*Status:* ${res.state}
*Verified:* ${res.verification === "VERIFIED" ? "Terverifikasi" : "Tidak"}
    `;
    return m.reply(teks);
}
break;

case "listgrup": {
    if (!isCreator) return;
    
    let teks = "\n*乂 List all group chat*\n";
    let a = await base.groupFetchAllParticipating();
    let gc = Object.values(a);
    
    teks += `\n*Total group:* ${gc.length}\n`;
    for (const u of gc) {
        teks += `
*ID:* ${u.id}
*Nama:* ${u.subject}
*Member:* ${u.participants.length}
*Status:* ${u.announce === false ? "Terbuka" : "Hanya Admin"}
*Pembuat:* ${u?.subjectOwner ? u.subjectOwner.split("@")[0] : "Sudah Keluar"}
        `;
    }
    return m.reply(teks);
}
break;

case "savekontak": {
    if (!isCreator) return m.reply(mess.owner);
    if (!text) return m.reply("idgrup nya mana?");
    
    let res = await base.groupMetadata(text);
    const halls = res.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
    
    let contacts = [];
    try {
        if (fs.existsSync("./database/contacts.json")) {
            contacts = JSON.parse(fs.readFileSync("./database/contacts.json"));
        }
    } catch (err) {
        console.error("Error baca contacts.json:", err);
    }
    
    for (let mem of halls) {
        if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
            contacts.push(mem);
        }
    }
    
    // Simpan ke JSON
    fs.writeFileSync('./database/contacts.json', JSON.stringify(contacts));
    
    try {
        const uniqueContacts = [...new Set(contacts)];
        const vcardContent = uniqueContacts.map(contact => {
            const nomor = contact.split("@")[0];
            return [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `FN:Buyer One Piace MD - ${nomor}`,
                `TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}`,
                "END:VCARD",
                ""
            ].join("\n");
        }).join("");
        
        fs.writeFileSync("./database/contacts.vcf", vcardContent, "utf8");
    } catch (err) {
        return m.reply(err.toString());
    } finally {
        if (m.chat !== m.sender) await m.reply(`*Berhasil membuat file kontak ✅*\nFile kontak sudah dikirim ke private chat\nTotal *${halls.length}* kontak`);
        
        await base.sendMessage(m.sender, {
            document: fs.readFileSync("./database/contacts.vcf"),
            fileName: "contacts.vcf",
            caption: `File kontak berhasil dibuat ✅\nTotal *${halls.length}* kontak`,
            mimetype: "text/vcard",
        }, { quoted: m });
        
        // Reset file dan array kontak
        contacts = [];
        fs.writeFileSync("./database/contacts.json", JSON.stringify(contacts));
        fs.writeFileSync("./database/contacts.vcf", "");
    }
}
break;

case "pushkontak": {
    if (!isCreator) return m.reply(mess.owner);
    if (!isGroup) return m.reply(mess.group);
    if (!text) return m.reply("pesan nya mana?");
    
    const teks = text;
    const jidawal = m.chat;
    const data = await base.groupMetadata(m.chat);
    const halls = data.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
    
    await m.reply(`Memproses pushkontak ke *${halls.length}* member grup`);
    
    for (let mem of halls) {
        if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
            await base.sendMessage(mem, { text: teks }, { quoted: qlocPush });
            await sleep(global.delayPushkontak);
        }
    }
    
    await base.sendMessage(jidawal, {
        text: `*Berhasil Pushkontak.`
    }, { quoted: m });
}
break;

case "jpm": {
    if (!isCreator) return m.reply(mess.owner);
    if (!text) return m.reply("pesan nya mana?");
    
    let allgrup = await base.groupFetchAllParticipating();
    let res = Object.keys(allgrup);
    let count = 0;
    const jid = m.chat;
    const teks = text;
    
    if (!global.owner) {
        console.error("Error: global.owner belum didefinisikan!");
        return m.reply("Owner belum diatur di konfigurasi bot.");
    }
    
    await m.reply(`proses ${res.length} grup...`);
    
    for (let i of res) {
        if (global.db.groups?.[i]?.blacklistjpm) continue;
        try {
            await base.sendMessage(i, {
                text: teks,
                contextInfo: {
                    isForwarded: false,
                    mentionedJid: [m.sender],
                    businessMessageForwardInfo: global.owner ? {
                        businessOwnerJid: global.owner + "@s.whatsapp.net"
                    } : undefined,
                }
            });
            count++;
            console.log(`✅ Berhasil mengirim ke ${i}`);
        } catch (e) {
            console.error(`❌ Gagal mengirim ke ${i}:`, e);
        }
        await sleep(global.delayJpm);
    }
    
    await base.sendMessage(jid, {
        text: `done ${count} grup`
    }, { quoted: m });
}
break;

case "jpmhidetag": {
    if (!isCreator) return m.reply(mess.owner);
    if (!text) return m.reply("pesan nya mana?");
    
    let allgrup = await base.groupFetchAllParticipating();
    let res = Object.keys(allgrup);
    let count = 0;
    const jid = m.chat;
    const teks = text;
    
    await m.reply(`proses ${res.length} grup...`);

    for (let id of res) {
        if (global.db.groups?.[id]?.blacklistjpm) continue;
        try {
            const metadata = await base.groupMetadata(id);
            const member = metadata.participants.map(v => v.id);

            await base.sendMessage(id, {
                text: teks,
                mentions: member,
                contextInfo: {
                    isForwarded: false,
                    mentionedJid: member,
                    businessMessageForwardInfo: global.owner ? {
                        businessOwnerJid: global.owner + "@s.whatsapp.net"
                    } : undefined,
                }
            });
            
            count++;
            console.log(`✅ Berhasil mengirim ke ${id}`);
        } catch (e) {
            console.error(`❌ Gagal mengirim ke ${id}:`, e);
        }
        await sleep(global.delayJpm);
    }

    await base.sendMessage(jid, {
        text: `done ${count} grup`,
    }, { quoted: m });
}
break;

case "del":
case "delete": {
  if (!m.quoted) return m.reply("reply pesan");
  if (!isCreator) return m.reply(mess.owner);
  if (!isGroup) {
    if (!m.quoted.key.fromMe) return m.reply("Pesan bukan milik bot!");
    return await base.sendMessage(m.chat, { delete: m.quoted.key });
  } else {
    if (!isBotGroupAdmins) return m.reply(mess.botAdmin);
    await base.sendMessage(m.chat, { delete: m.quoted.key });
  }
}
break;

case "addprem": 
case "addpremium": {
  if (!isCreator) return m.reply(mess.owner);
  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("mana nomornya?");
  }
  if (premium.includes(target)) {
    return m.reply("nomor sudah terdaftar premium");
  }
  premium.push(target);
  fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
  m.reply(`done`, {
    mentions: [target]
  });
}
break;

case "delprem": 
case "delpremium": {
  if (!isCreator) return m.reply(mess.owner);
  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  } else {
    return m.reply("mana nomornya?");
  }
  const index = premium.indexOf(target);
  if (index === -1) {
    return m.reply("nomor tidak di list premium ");
  }
  premium.splice(index, 1);
  fs.writeFileSync("./database/premium.json", JSON.stringify(premium));
  m.reply(`done`, {
    mentions: [target]
  });
}
break;

case 'clearuser': case 'clearusr': {
    if (!isCreator) return m.reply(mess.owner);
    try {
        let f = await fetch(domain + "/api/application/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apikey,
            }
        });
        let res = await f.json();
        let users = res.data;
        if (!users || users.length === 0) return m.reply('Tidak ada user yang ditemukan.');

        let deletedUsers = [];
        let failedUsers = [];

        for (let user of users) {
            let u = user.attributes;
            if (!u.root_admin) {
                let deleteUser = await fetch(domain + "/api/application/users/" + u.id, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + apikey,
                    }
                });
                if (deleteUser.ok) {
                    deletedUsers.push(u.id);
                } else {
                    let errorText = await deleteUser.text();
                    failedUsers.push({ id: u.id, error: `${deleteUser.status} - ${errorText}` });
                }
            }
        }

        let replyText = `*Hasil Penghapusan User*\nBerhasil: ${deletedUsers.length}\nGagal: ${failedUsers.length}`;
        if (failedUsers.length > 0) {
            replyText += `\nDetail Gagal:\n` + failedUsers.map(f => `ID: ${f.id}, Error: ${f.error}`).join("\n");
        }
        m.reply(replyText);
    } catch (error) {
        return m.reply('Terjadi kesalahan: ' + error.message);
    }
}
break;

case "tourl": {
    if (!/image/.test(mime)) return m.reply("fotonya mana?");
    try {
        let media = await base.downloadAndSaveMediaMessage(qmsg);
        const { ImageUploadService } = require('node-upload-images');
        const service = new ImageUploadService('pixhost.to');
        let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'HanX.jpg');
        await base.sendMessage(m.chat, { text: directLink.toString() }, { quoted: m });
        await fs.unlinkSync(media);
    } catch (e) {
        m.reply("Gagal upload image: " + e.message);
    }
}
break;

case "owner": {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:HanX-ID
TEL;type=CELL;waid=${global.owner}: ${global.owner}
END:VCARD`;
    await base.sendMessage(m.chat, { contacts: { displayName: "HanX-ID", contacts: [{ vcard }] } }, { quoted: m });
}
break;

case "self": {
    if (!isCreator) return m.reply(mess.owner);
    base.public = false;
    m.reply('done');
}
break;

case "public": {
    if (!isCreator) return m.reply(mess.owner);
    base.public = true;
    m.reply('done');
}
break;

case "addown":
case "addowner": {
  if (!isCreator) return m.reply(mess.owner);
  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  } else {
    return m.reply("mana nomornya?");
  }
  const nomor = target.split("@")[0];
  const cek = await base.onWhatsApp(nomor);
  if (!cek.length) return m.reply("Nomor tidak valid atau tidak terdaftar di WhatsApp!");
  if (ownplus.includes(target)) return m.reply(`@${nomor} sudah menjadi owner.`, { mentions: [target] });
  if (target === botNumber) return m.reply("Itu nomor bot");
  if (nomor === global.owner) return m.reply("Itu nomor gw");
  ownplus.push(target);
  fs.writeFileSync("./database/owner.json", JSON.stringify(ownplus, null, 2));
  m.reply(`done`, { mentions: [target] });
}
break;

case "delown":
case "delowner": {
  if (!isCreator) return m.reply(mess.owner);
  let target;
  if (m.quoted) {
    target = m.quoted.sender;
  } else if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (text) {
    target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  } else {
    return m.reply("mana nomornya?");
  }
  const nomor = target.split("@")[0];
  if (!ownplus.includes(target)) return m.reply(`@${nomor} tidak ditemukan di daftar owner.`, { mentions: [target] });
  if (target === botNumber) return m.reply("Tidak bisa menghapus nomor bot sendiri.");
  if (nomor === global.owner) return m.reply("Tidak bisa menghapus owner utama.");
  ownplus.splice(ownplus.indexOf(target), 1);
  fs.writeFileSync("./database/owner.json", JSON.stringify(ownplus, null, 2));
  m.reply(`done`, { mentions: [target] });
}
break;

case "sticker":
case "s": {
  if ((m.mtype === "imageMessage" || m.mtype === "videoMessage") && !m.quoted) {
    return m.reply("reply aja anj");
  }

  if (!m.quoted || !/image|video/.test((m.quoted.msg || m.quoted).mimetype || "")) {
    return m.reply("reply foto/video");
  }

  let mimeType = (m.quoted.msg || m.quoted).mimetype || "";
  let media = await base.downloadMediaMessage(m.quoted);
  const { Sticker, StickerTypes } = require("wa-sticker-formatter");

  try {
    if (/image/.test(mimeType)) {
      const stiker = new Sticker(media, {
        author: "HanX",
        type: StickerTypes.FULL,
        quality: 80,
      });
      const buffer = await stiker.toBuffer();
      await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
    } else if (/video/.test(mimeType)) {
      let durasi = m.quoted.message?.videoMessage?.seconds || 0;
      if (durasi > 15) return m.reply("durasi video maksimal 15 detik");

      const stiker = new Sticker(media, {
        author: "HanX",
        type: StickerTypes.CROPPED,
        quality: 100,
        animated: true,
      });
      const buffer = await stiker.toBuffer();
      await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    return m.reply("Gagal membuat sticker");
  }
}
break;

case "brat": {
  const { Sticker, StickerTypes } = require('wa-sticker-formatter');
  if (!text) return m.reply("teksnya mana?");

  try {
    const imageUrl = `https://api.nekorinn.my.id/maker/brat?text=${encodeURIComponent(text)}&theme=white`;

    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const sticker = new Sticker(res.data, {
      author: 'HanX',
      type: StickerTypes.FULL,
      quality: 80,
    });

    const buffer = await sticker.toBuffer();
    await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply("Error!");
  }
}
break;

case "bratvid": {
  const { Sticker, StickerTypes } = require('wa-sticker-formatter');
  if (!text) return m.reply("teksnya mana?");

  try {
    const videoUrl = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;
    const res = await axios.get(videoUrl, { responseType: "arraybuffer" });

    const sticker = new Sticker(res.data, {
      type: StickerTypes.CROPPED, 
      author: 'HanX',
      quality: 100,
      animated: true
    });

    const buffer = await sticker.toBuffer();
    await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Error!");
  }
}
break;

case "sanim": {
  const { Sticker, StickerTypes } = require('wa-sticker-formatter');
  if (!text) return m.reply("teksnya mana?");

  try {
    const imageUrl = `https://fastrestapis.fasturl.cloud/maker/animbrat?text=${encodeURIComponent(text)}&position=center&mode=image`;

    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const sticker = new Sticker(res.data, {
      author: 'HanX',
      type: StickerTypes.FULL,
      quality: 80,
    });

    const buffer = await sticker.toBuffer();
    await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply("Error!");
  }
}
break;

case "sloli": {
  const { Sticker, StickerTypes } = require('wa-sticker-formatter');

  try {
    const imageUrl = `https://api.nekorinn.my.id/random/loli`;

    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const sticker = new Sticker(res.data, {
      author: 'HanX',
      type: StickerTypes.FULL,
      quality: 80,
    });

    const buffer = await sticker.toBuffer();
    await base.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
  } catch (err) {
    console.error(err);
    m.reply("Error!");
  }
}
break;

case "waifu": {
  try {
    const res = await axios.get("https://api.waifu.pics/sfw/waifu");
    await base.sendMessage(from, { image: { url: res.data.url } }, { quoted: m });
  } catch {
    m.reply("Gagal ambil foto waifu.");
  }
}
break;

case "waifu2": {
  try {
    let imageUrl = "https://api.nekorinn.my.id/waifuim/waifu";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto waifu.");
  }
}
break;

case "waifu3": {
  try {
    let imageUrl = "https://api.nekorinn.my.id/waifuim/uniform";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto waifu.");
  }
}
break;

case "bluearchive": {
  try {
    let imageUrl = "https://api.siputzx.my.id/api/r/blue-archive";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto blue archive.");
  }
}
break;

case "loli": {
  try {
    let imageUrl = "https://api.nekorinn.my.id/random/loli";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto loli.");
  }
}
break;

case "cosplay": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  try {
    let imageUrl = "https://api.nekorinn.my.id/random/cosplay";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto cosplay.");
  }
}
break;

case "hentai": {
  if (!isCreator && !isPremium) return m.reply(mess.prem);
  try {
    let imageUrl = "https://fastrestapis.fasturl.cloud/sfwnsfw/anime?type=nsfw&tag=waifu";
    await base.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal ambil foto hentai.");
  }
}
break;

case "ai": {
  if (m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }
  if (!text) return m.reply("pesan nya mana?");

  try {
    let res = await axios.get(`https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(text)}`);
    if (!res || !res.data || !res.data.result) return m.reply("Gagal mendapatkan respon.");
    m.reply(res.data.result);
  } catch (e) {
    console.error(e);
    m.reply("Error saat memproses permintaan.");
  }
}
break;

case "play": {
  if (!text) return m.reply("judul nya mana?");

  try {
    let res = await fetch(`https://api.kenshiro.cfd/api/downloader/play?q=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json || !json.status || !json.data || !json.data.downloadLink) {
      return m.reply("Gagal mendapatkan lagu.");
    }

    await base.sendMessage(
      m.chat,
      {
        audio: { url: json.data.downloadLink },
        mimetype: "audio/mp4",
        ptt: false,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mengunduh lagu.");
  }
}
break;

case "play2": {
  if (!text) return m.reply("judul nya mana?");

  try {
    let res = await fetch(`https://api.kenshiro.cfd/api/downloader/play?q=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json || !json.status || !json.data || !json.data.downloadLink) {
      return m.reply("Gagal mendapatkan lagu.");
    }

    await base.sendMessage(
      m.chat,
      {
        audio: { url: json.data.downloadLink },
        mimetype: "audio/mp4",
        ptt: true,
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mengunduh lagu.");
  }
}
break;


case "cryptocek": {
  try {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      "Mozilla/5.0 (X11; Linux x86_64)",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      "Mozilla/5.0 (Android 11; Mobile; rv:89.0)",
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=200&page=1&sparkline=false&price_change_percentage=1h", {
      headers: { "User-Agent": randomUserAgent }
    });

    const data = await res.json();
    if (!data || !Array.isArray(data)) return m.reply("Gagal mengambil data.");

    let teks = "*Daftar 200 Coin Crypto :*\n\n";
    for (let coin of data) {
      let change = coin.price_change_percentage_1h_in_currency ?? 0;
      let sign = change >= 0 ? "+" : "";
      teks += `• ${coin.market_cap_rank}. ${coin.name} (${coin.symbol.toUpperCase()})\n`;
      teks += `  *Harga:* Rp ${coin.current_price.toLocaleString("id-ID")}\n`;
      teks += `  *1 Jam:* ${sign}${change.toFixed(2)}%\n\n`;
    }

    await m.reply(teks.trim());
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mengambil data crypto.");
  }
}
break;

case "tiktok": {
  if (!text) return m.reply("link nya mana?");
  try {
    let api = `https://fastrestapis.fasturl.cloud/downup/ttdown?url=${encodeURIComponent(text)}`;
    let res = await fetch(api);
    let json = await res.json();
    if (!json?.result?.media?.videoUrl) return m.reply("Gagal mengambil video.");
    await base.sendMessage(m.chat, { video: { url: json.result.media.videoUrl } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan.");
  }
}
break;

case "instagram": {
  if (!text) return m.reply("link nya mana?");
  try {
    let api = `https://fastrestapis.fasturl.cloud/downup/igdown?url=${encodeURIComponent(text)}`;
    let res = await fetch(api);
    let json = await res.json();
    if (!json?.result?.data?.length) return m.reply("Gagal mengambil media.");
    await base.sendMessage(m.chat, { video: { url: json.result.data[0].url } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan.");
  }
}
break;

case "nulis": {
  if (!text) return m.reply("teksnya mana?");
  try {
    let url = `https://api.siputzx.my.id/api/m/nulis?text=${encodeURIComponent(text)}`;
    await base.sendMessage(m.chat, { image: { url } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil hasil nulis.");
  }
}
break;

case "nulis2": {
  if (!text) return m.reply("teksnya mana?");
  try {
    let url = `https://nirkyy.koyeb.app/api/v1/nulis?text=${encodeURIComponent(text)}`;
    await base.sendMessage(m.chat, { image: { url } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil hasil nulis.");
  }
}
break;

case "apresiasi": {
  if (!text) return m.reply("nama nya nana?");
  try {
    let url = `https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${encodeURIComponent(text)}`;
    await base.sendMessage(m.chat, { image: { url } }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil sertifikat apresiasi.");
  }
}
break;

case "trackip": {
  if (!args[0]) return base.sendMessage(from, { text: "mana ip nya?" }, { quoted: m });

  let ip = args[0];
  try {
    let res = await axios.get(`http://ip-api.com/json/${ip}`);
    if (res.data.status !== "success") {
      return base.sendMessage(from, { text: `Gagal melacak IP: ${ip}` }, { quoted: m });
    }

    let data = res.data;
    let pesan = `Info IP: ${ip}\n` +
                `Negara: ${data.country}\n` +
                `Wilayah: ${data.regionName}\n` +
                `Kota: ${data.city}\n` +
                `ISP: ${data.isp}\n` +
                `Timezone: ${data.timezone}\n` +
                `Latitude: ${data.lat}\n` +
                `Longitude: ${data.lon}`;

    await base.sendMessage(from, { text: pesan }, { quoted: m });
  } catch (e) {
    await base.sendMessage(from, { text: "Error saat melacak IP." }, { quoted: m });
  }
  }
break;

case 'cekip': {
  if (!text) return base.sendMessage(m.chat, { text: 'mana domain nya?' }, { quoted: m });

  try {
    let domain = text.replace(/https?:\/\//, '').split('/')[0];
    let dns = require('dns');
    dns.lookup(domain, (err, address) => {
      if (err) {
        base.sendMessage(m.chat, { text: `Gagal ambil IP: ${err.message}` }, { quoted: m });
      } else {
        base.sendMessage(m.chat, { text: `${address}` }, { quoted: m });
      }
    });
  } catch (e) {
  }
}
break;

case "portscan": {
  if (!args[0]) return m.reply("domain/ip");
  const target = args[0];
  const net = require('net');

  const ports = [
    20, 21, 22, 23, 25, 53, 67, 68, 69, 80,
    110, 111, 123, 135, 137, 138, 139, 143,
    161, 162, 179, 389, 443, 445, 465, 514,
    515, 587, 631, 636, 993, 995, 1080, 1194,
    1433, 1521, 1723, 2049, 2082, 2083, 2095,
    2096, 3306, 3389, 4444, 4899, 5000, 5060,
    5432, 5900, 6000, 6667, 8080, 8443, 8888,
    9090, 10000, 32768, 49152, 49153, 49154
  ];
  let openPorts = [];

  const scanPort = (port) => new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      openPorts.push(port);
      socket.destroy();
      resolve();
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve();
    });
    socket.on('error', () => {
      socket.destroy();
      resolve();
    });
    socket.connect(port, target);
  });

  (async () => {
    for (let port of ports) {
      await scanPort(port);
    }
    if (openPorts.length === 0) {
      m.reply(`Tidak ada port yang terbuka.`);
    } else {
      m.reply(`Port terbuka di ${target}: ${openPorts.join(', ')}`);
    }
  })();
}
break;

case "whois": {
  if (!args[0]) {
    return base.sendMessage(from, { text: "domain nya mana?" }, { quoted: m });
  }
  const whois = require('whois');
  whois.lookup(args[0], (err, data) => {
    if (err) {
      return base.sendMessage(from, { text: "Gagal mendapatkan info." }, { quoted: m });
    }
    base.sendMessage(from, { text: `${args[0]}:\n${data}` }, { quoted: m });
  });
}
break;

case "subdomain": {
  if (!args[0]) return m.reply("domain nya mana?");
  const domain = args[0];
  try {
    let res = await axios.get(`https://api.sublist3r.com/search.php?domain=${domain}`);
    if (!res.data || res.data.length === 0) return m.reply("subdomain tidak ditemukan");
    let subs = Array.isArray(res.data) ? res.data.join("\n") : res.data;
    if (subs.length > 1500) subs = subs.slice(0,1500) + "\n...[truncated]";
    m.reply(`Subdomain untuk ${domain}:\n${subs}`);
  } catch(e) {
    m.reply("Gagal akses API subdomain.");
  }
}
break;

case "httpcode": {
  if (!args[0]) return m.reply("domain nya mana?");
  const url = args[0].startsWith("http") ? args[0] : "http://" + args[0];
  try {
    let res = await axios.get(url);
    m.reply(`Status HTTP: ${res.status} ${res.statusText}`);
  } catch (e) {
    if (e.response) m.reply(`Status HTTP: ${e.response.status} ${e.response.statusText}`);
    else m.reply("Gagal akses URL.");
  }
}
break;

case "ambilnomor": {
  if (!m.isGroup) return m.reply(mess.group);
  if (!isCreator) return m.reply(mess.owner);
  
  try {
    const metadata = await base.groupMetadata(m.chat);
    const participants = metadata.participants || [];

    const nomorList = participants
      .map(p => p.id.split("@")[0])
      .filter(n => n && n !== botNumber.split("@")[0]);

    if (!nomorList.length) return m.reply("Tidak ada nomor valid yang ditemukan.");

    const isi = nomorList.join("\n");
    const tempFile = `./nomor.txt`;

    require("fs").writeFileSync(tempFile, isi);

    await base.sendMessage(m.chat, {
      document: require("fs").readFileSync(tempFile),
      fileName: metadata.subject + ".txt", 
      mimetype: "text/plain"
    }, { quoted: m });

    require("fs").unlinkSync(tempFile);
  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil nomor.");
  }
}
break;

// ==================== DEFAULT HANDLER ==================== //
default:
    if (budy.startsWith('=>')) {
        if (!isCreator) return;
        try {
            let evaled = await eval(`(async () => { ${budy.slice(2)} })()`);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await m.reply(evaled);
        } catch (err) {
            await m.reply(String(err));
        }
    }

    if (budy.startsWith('$')) {
        if (!isCreator) return;
        if (!text) return;
        exec(budy.slice(1), (err, stdout) => {
            if (err) return m.reply(`${err}`);
            if (stdout) return m.reply(stdout);
        });
    }

    if (budy.startsWith('<')) {
        if (!Access) return;
        let kode = budy.trim().split(/ +/)[0];
        let teks;
        try {
            teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q} })()`);
        } catch (e) {
            teks = e;
        } finally {
            await m.reply(require('util').format(teks));
        }
    }
}
} catch (err) {
    console.log(require("util").format(err));
}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})