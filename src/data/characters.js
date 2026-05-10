// Character database with objects containing name, fullName, and image path
// Images in /characters/jjk/, /characters/ds/, /characters/bs/
// Fallback: if image fails to load, shows styled initials avatar

export const CATEGORIES = {
  "Jujutsu Kaisen": [
    { name: "Gojo", fullName: "Satoru Gojo", image: "/characters/jjk/gojo.png" },
    { name: "Sukuna", fullName: "Ryomen Sukuna", image: "/characters/jjk/sukuna.png" },
    { name: "Yuji", fullName: "Yuji Itadori", image: "/characters/jjk/yuji.png" },
    { name: "Megumi", fullName: "Megumi Fushiguro", image: "/characters/jjk/megumi.png" },
    { name: "Nobara", fullName: "Nobara Kugisaki", image: "/characters/jjk/nobara.png" },
    { name: "Toji", fullName: "Toji Fushiguro", image: "/characters/jjk/toji.png" },
    { name: "Geto", fullName: "Suguru Geto", image: "/characters/jjk/geto.png" },
    { name: "Yuta", fullName: "Yuta Okkotsu", image: "/characters/jjk/yuta.png" },
    { name: "Mahito", fullName: "Mahito", image: "/characters/jjk/mahito.png" },
    { name: "Todo", fullName: "Aoi Todo", image: "/characters/jjk/todo.png" },
    { name: "Nanami", fullName: "Kento Nanami", image: "/characters/jjk/nanami.png" },
    { name: "Maki", fullName: "Maki Zenin", image: "/characters/jjk/maki.png" },
    { name: "Panda", fullName: "Panda", image: "/characters/jjk/panda.png" },
    { name: "Inumaki", fullName: "Toge Inumaki", image: "/characters/jjk/inumaki.png" },
    { name: "Kashimo", fullName: "Hajime Kashimo", image: "/characters/jjk/kashimo.png" },
    { name: "Hakari", fullName: "Kinji Hakari", image: "/characters/jjk/hakari.png" },
  ],
  "Demon Slayer": [
    { name: "Tanjiro", fullName: "Tanjiro Kamado", image: "/characters/ds/tanjiro.png" },
    { name: "Nezuko", fullName: "Nezuko Kamado", image: "/characters/ds/nezuko.png" },
    { name: "Zenitsu", fullName: "Zenitsu Agatsuma", image: "/characters/ds/zenitsu.png" },
    { name: "Inosuke", fullName: "Inosuke Hashibira", image: "/characters/ds/inosuke.png" },
    { name: "Rengoku", fullName: "Kyojuro Rengoku", image: "/characters/ds/rengoku.png" },
    { name: "Akaza", fullName: "Akaza", image: "/characters/ds/akaza.png" },
    { name: "Kokushibo", fullName: "Kokushibo", image: "/characters/ds/kokushibo.png" },
    { name: "Muzan", fullName: "Muzan Kibutsuji", image: "/characters/ds/muzan.png" },
    { name: "Daki", fullName: "Daki", image: "/characters/ds/daki.png" },
    { name: "Gyutaro", fullName: "Gyutaro", image: "/characters/ds/gyutaro.png" },
    { name: "Tengen", fullName: "Tengen Uzui", image: "/characters/ds/tengen.png" },
    { name: "Shinobu", fullName: "Shinobu Kocho", image: "/characters/ds/shinobu.png" },
    { name: "Giyu", fullName: "Giyu Tomioka", image: "/characters/ds/giyu.png" },
    { name: "Mitsuri", fullName: "Mitsuri Kanroji", image: "/characters/ds/mitsuri.png" },
    { name: "Sanemi", fullName: "Sanemi Shinazugawa", image: "/characters/ds/sanemi.png" },
    { name: "Obanai", fullName: "Obanai Iguro", image: "/characters/ds/obanai.png" },
  ],
  "Brawl Stars": [
    { name: "Leon", fullName: "Leon", image: "/characters/bs/leon.png" },
    { name: "Crow", fullName: "Crow", image: "/characters/bs/crow.png" },
    { name: "Spike", fullName: "Spike", image: "/characters/bs/spike.png" },
    { name: "Shelly", fullName: "Shelly", image: "/characters/bs/shelly.png" },
    { name: "Colt", fullName: "Colt", image: "/characters/bs/colt.png" },
    { name: "Edgar", fullName: "Edgar", image: "/characters/bs/edgar.png" },
    { name: "Mortis", fullName: "Mortis", image: "/characters/bs/mortis.png" },
    { name: "Fang", fullName: "Fang", image: "/characters/bs/fang.png" },
    { name: "Buzz", fullName: "Buzz", image: "/characters/bs/buzz.png" },
    { name: "Surge", fullName: "Surge", image: "/characters/bs/surge.png" },
    { name: "Cordelius", fullName: "Cordelius", image: "/characters/bs/cordelius.png" },
    { name: "Chester", fullName: "Chester", image: "/characters/bs/chester.png" },
    { name: "Kit", fullName: "Kit", image: "/characters/bs/kit.png" },
    { name: "Stu", fullName: "Stu", image: "/characters/bs/stu.png" },
    { name: "Melodie", fullName: "Melodie", image: "/characters/bs/melodie.png" },
    { name: "Kenji", fullName: "Kenji", image: "/characters/bs/kenji.png" },
  ],
};

export const CATEGORY_META = {
  "Jujutsu Kaisen": {
    icon: "👁️",
    subtitle: "Cursed Energy",
    gradient: "from-purple-600 to-blue-600",
    glow: "purple",
  },
  "Demon Slayer": {
    icon: "🔥",
    subtitle: "Breathing Styles",
    gradient: "from-red-600 to-orange-600",
    glow: "orange",
  },
  "Brawl Stars": {
    icon: "⭐",
    subtitle: "Brawl Arena",
    gradient: "from-yellow-500 to-cyan-500",
    glow: "cyan",
  }
};
