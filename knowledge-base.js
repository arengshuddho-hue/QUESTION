const PORTAL_INFO = `
Website naam: CSE-57 Section C Academic Portal
Repo style header e dekhায়: CSE-57 / Section-C

=== Navbar (upore) ===
- Search button (Cmd+K / Ctrl+K diye o open kora jay) - pura site e instant search
- Notification bell - notun kono update asle red badge dekhay, click korle
  dropdown e shob recent notification dekha jay
- Quick Menu (hamburger icon) - ekta sidebar khole jekhane shob resource er
  shortcut link thake, category wise sajano (Personal, Academic, Competitive,
  Study Material, Subjects)
- "..." (More Options) menu - "About Portal" (README style info) ebong
  "Toggle Theme" (dark/light mode switch) ekhane pawa jay

=== Scrolling Ticker ===
Navbar er nichey ekta scrolling notice bar thake ("INFO" label soho),
jekhane important announcement dekhano hoy.

=== Category Filter ===
Homepage er main grid e ekta dropdown filter button ache ("All Categories"),
jeta diye card gulo category onujayi filter kora jay:
- Personal
- Academic
- Competitive
- Study Material
- Subjects

=== Resource Cards (Main Grid) ===
- Note Vault: code diye personal note/file save o access korar feature (login lagena)
- Update Files: Google Form er link, jekhane keu file/material submit korte pare
- Upcoming Courses
- Faculty List: teacher der details
- Classroom Code: Google Classroom join korar code
- Google Classroom: subject wise synced materials (DSA Lab, DSA Theory, SE
  Theory, SE Lab, Data Comm Theory, IP Lab)
- Class Routine: weekly class schedule
- Exam Routine
- Upcoming Hackathon
- Upcoming CP (contest)
- Reference Links
- Books
- Suggestions
- Notes
- PQ Solutions (Previous Question Solutions)
- Subject cards: DSA 2, Software Engg, Complex Variables, Numerical Methods,
  Data Communication, Internet Prog. Lab

=== Note Vault (kivabe kaj kore) ===
- "Note Vault" card e click korle ekta modal khole, jekhane 2 ta tab thake:
  1) "Open Note" - tumi tomar code likhle shei code diye save kora
     note/text/code/image/PDF dekha jay
  2) "Save New Note" - tumi nijer moto ekta unique code set kore (ba
     "dice" button diye random code generate kore) text, code (multiple
     language support soho, live run kora jay), image, ba PDF save korte paro
- Kono login lagbe na, code ta i tomar chabi
- Note gulo 30 din por automatically delete hoye jay
- Save kora code snippet ba web (HTML/CSS/JS) note "Run" button diye
  live execute/preview kora jay

=== Search (Cmd+K) ===
Uporer search button e click korle, ba keyboard e Cmd+K (Mac) / Ctrl+K
(Windows) chaple ekta search palette khole. Ekhane type korle shob card o
resource item instant search hoy, arrow key diye navigate kore Enter e
select kora jay.

=== Notifications ===
Kono notun resource/file add hole (admin panel theke), shei update
notification hishebe bell icon e show hoy. Click korle shei resource ta
shorasori khule jay.

=== Admin Panel (shudhu admin er jonno) ===
- Admin (Shuddha) email/password diye login kore
- Prottek category er jonno alada kore Link, File Upload (Cloudinary er
  madhome), Image, Plain Text, ba Passcode add korte pare
- "Sync from Classroom" button diye Google Classroom theke notun material
  automatically pull kora jay
- Live stats dekha jay: koyjon active ache ebong total visit koto

=== Kivabe Use Korte Hoy (Common Questions) ===
Q: Class routine kothay pabo?
A: Homepage e "Class Routine" card e click korলে full weekly schedule
   dekhte parbe.

Q: Note Vault kivabe kaj kore?
A: Note Vault card e click kore "Open Note" tab e giye tomar code ta
   likhte hobe. Code sothik hole tomar saved note/file dekha jabe. Notun
   note save korte chaile "Save New Note" tab e giye nijer moto ekta
   code set kore save korte parba.

Q: Amar note ki kokhono delete hoye jay?
A: Hae, note gulo save howar 30 din por automatically delete hoye jay.

Q: Search kivabe use korbo?
A: Uporer search icon e click koro, ba keyboard e Ctrl+K (Windows) / Cmd+K
   (Mac) chapo. Tarpor type korle shob resource instant search hobe.

Q: Notun kono update ache kina kivabe bujhbo?
A: Uporer notification bell icon e click korলে shob recent update dekha
   jabe. Notun update thakle bell er upore ekta red number dekhabe.

Q: Dark/Light mode kivabe switch korbo?
A: Navbar er "..." (more options) menu e giye "Toggle Theme" e click koro.

Q: Google Classroom er material kothay pabo?
A: "Google Classroom" card e click korle subject wise (DSA Lab, SE Theory,
   Data Comm Theory, etc.) synced material dekhte parba.

=== Kono Question Answer Na Thakle ===
Jodi kono question er answer ei information e na thake, tahole bolte hobe:
"Eta niye amar kache exact information nei, tumi Shuddha (admin) er sathe
directly jogajog koro ba 'Update Files' form ba notice ticker check koro."
Kokhono nijer theke fake information banai deya jabe na.
`;

module.exports = { PORTAL_INFO };