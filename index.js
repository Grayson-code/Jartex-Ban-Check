const fs = require("fs");
const {
  Client,
  Intents
} = require("discord.js");
const dotenv = require("dotenv");
const { token } = require("./config.json");
const path = require("path");
const { MessageEmbed } = require("discord.js");

const puppeteer = require("puppeteer");



dotenv.config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

/*
This is Achieved by web scraping so this is not a reliable solution,
if in any time line they do release a api i suggest you use it as its way better.
you can also use a command handler but if u dont know how to then just use the below code
*/
client.on("messageCreate", async (message) => {
  if (message.content.includes("!bans"))
    {
    //if using a command handler start from there
    let split = message.content.trim().split(" ");
    let user = split[1];
    let channel = await client.channels.fetch("897357176102846465");
    let link = "https://jartexnetwork.com/bans/search/" + `${user}`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`${link}`);
    let punishmentlist = await page.evaluate(() => {
      const plTag = document.querySelector(".td._reason");
      return plTag.innerHTML;
    });
    let punishmenttime = await page.evaluate(() => {
      const ptTag = document.querySelector(".td._date");
      return ptTag.innerHTML;
    });
    let punishmentexpire = await page.evaluate(() => {
      const peTag = document.querySelector(".td._expires");
      return peTag.innerHTML;
    });
    // channel.send(`The Users ban data can be found here ${link} , latest punishment = ${punishmentlist} , was issued in ${punishmenttime}`);
    await browser.close();
    let embed = new MessageEmbed()
      .setTitle(`${user}'s Punishment History(URL)`)
      .setDescription("The Punishment Data Of the requested user")
      .setURL(`${link}`)
      .setColor("BLURPLE")

      .addFields(
        { name: `Punishment History of ${user}`, value: `${punishmentlist}` },
        {
          name: "Time Issued",
          value: `The Time the punishment was issued in is ${punishmenttime}`,
        },
        {
          name: "Expires In",
          value: `Their Punishment expires in ${punishmentexpire}`,
        }
      )
      .setTimestamp()
      .setFooter(`Fulfilled By puppeteer npm`);

    channel.send({ embeds: [embed] });
    channel.send(`${punishmentlist}`);
  } // if using command handler ignore this object ('}')
});

client.login(process.env.token);
