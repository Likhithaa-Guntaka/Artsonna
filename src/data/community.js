import { creatives } from '@/data/marketplace';
const work=(person,index)=>creatives[person].work[index].image;
const u=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=85`;
const p=id=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;
const avatar=(name,id)=>({name,avatar:u(id)});
export const communityEvents=[
 {id:'lower-manhattan-photo-walk',title:'Lower Manhattan Photo Walk',date:'Aug 23',time:'5:30 PM',location:'Seaport',type:'Offline',attending:84,series:'Lower Manhattan Photo Walk',frequency:'Monthly',pastAttendance:412,usualAttendance:76,image:p('466685'),description:'Follow golden-hour light through the Seaport and along the East River with photographers from across the city.'},
 {id:'open-portfolio-review',title:'Open Portfolio Review',date:'Aug 28',time:'7:00 PM',location:'Online',type:'Online',attending:126,series:'Open Portfolio Review',frequency:'Monthly',image:p('3184465'),description:'Bring a focused portfolio edit for thoughtful table-style feedback from working New York creatives.'},
 {id:'brooklyn-type-night',title:'Brooklyn Type Night',date:'Sep 4',time:'6:30 PM',location:'DUMBO',type:'Offline',attending:58,series:'Brooklyn Type Night',frequency:'Monthly',pastAttendance:638,usualAttendance:54,image:p('1681010'),description:'An evening of letterforms, editorial systems, printed matter, and informal critique in DUMBO.'},
 {id:'golden-hour-portrait-meetup',title:'Golden Hour Portrait Meetup',date:'Aug 30',time:'4:00 PM',location:'Central Park',type:'Offline',attending:42,image:p('1755428'),description:'A relaxed outdoor portrait session built around backlight, natural movement, and late-summer color.'},
 {id:'analog-film-swap',title:'Analog Film Swap & Talk',date:'Sep 10',time:'6:00 PM',location:'Williamsburg',type:'Offline',attending:31,series:'Analog Film Swap & Talk',frequency:'Bi-monthly',pastAttendance:89,usualAttendance:35,image:p('3693701'),description:'Trade film stocks, compare scans, and share practical notes on cameras, labs, and 35mm workflows.'},
 {id:'beauty-editorial-makeup',title:'Beauty & Editorial Makeup Workshop',date:'Sep 6',time:'1:00 PM',location:'Chelsea',type:'Offline',attending:23,image:p('3379943'),description:'A close-up workshop on skin, color, texture, and camera-ready editorial makeup techniques.'}
];
export const boards=[
 {id:'nyc-editorial',title:'NYC Editorial Inspo',description:'High-fashion references, moody lighting, and magazine-style compositions.',contributors:[avatar('Sofia Reyes','1494790108377-be9c29b29330'),avatar('Deja Marsh','1531123897727-8f129e1688ce'),avatar('Lena Petrova','1544005313-94ddf0286df2')],images:[u('1515886657613-9f3515b0c78f'),u('1529139574466-a303027c1d8b'),u('1483985988355-763728e1935b'),u('1469334031218-e382a71b716b'),u('1492684223066-81342ee5ff30'),u('1516321318423-f06f85e504b3'),u('1487412720507-e7ab37603c6f'),u('1509631179647-0177331693ae')]},
 {id:'y2k-styling',title:'Y2K Styling References',description:'Early-2000s fashion, bold color, and expressive streetwear.',contributors:[avatar('Micah Torres','1500648767791-00dcc994a43e'),avatar('Sofia Reyes','1494790108377-be9c29b29330'),avatar('Deja Marsh','1531123897727-8f129e1688ce')],images:[u('1529139574466-a303027c1d8b'),u('1515886657613-9f3515b0c78f'),u('1483985988355-763728e1935b'),u('1469334031218-e382a71b716b'),u('1521337581100-8ca9a73a5f79'),u('1517604931442-7e0c8ed2963c'),u('1489599849927-2ee91cede3ba'),u('1509631179647-0177331693ae')]},
 {id:'golden-hour-light',title:'Golden Hour & Natural Light',description:'Outdoor portrait and lifestyle photography shaped by natural light.',contributors:[avatar('Ravi Desai','1507003211169-0a1dd7228f2d'),avatar('Odessa Blume','1534528741775-53994a69daeb'),avatar('Maya Chen','1494790108377-be9c29b29330')],images:[p('1755428'),u('1516035069371-29a1b244cc32'),u('1524368535928-5b5e00ddc76b'),u('1521737604893-d14cc237f11d'),u('1496588152823-86ff7695e68f'),u('1518005020951-eccb494ad742'),u('1522083165195-3424ed129620'),u('1518391846015-55a9cc003b25')]},
 {id:'set-design',title:'Set Design & Still Life',description:'Product and set styling references with minimal, color-blocked compositions.',contributors:[avatar('Sam Whitfield','1506794778202-cad84cf45f1d'),avatar('Studio North','1497366754035-f200968a6e72'),avatar('Jules Martinez','1519345182560-3f2917c472ef')],images:[u('1497366811353-6870744d04b2'),u('1513364776144-60967b0f800f'),u('1523726491678-bf852e717f6a'),u('1542744094-3a31f272c490'),u('1493225457124-a3eb161ffa5f'),u('1506157786151-b8491531f063'),u('1492619375914-88005aa9e8fb'),u('1545235617-9465d2a55698')]},
 {id:'motion-music-video',title:'Motion & Music Video Stills',description:'Cinematic frame grabs and lighting references for music video work.',contributors:[avatar('The Hollow Collective','1524504388940-b1c1722653e1'),avatar('Leo Zhang','1507003211169-0a1dd7228f2d'),avatar('Camila Torres','1534528741775-53994a69daeb')],images:['https://images.pexels.com/videos/8040195/adult-art-band-bass-8040195.jpeg?auto=compress&cs=tinysrgb&w=1400',u('1516280440614-37939bbacd81'),u('1549490349-8643362247b6'),u('1513475382585-d06e58bcb0e0'),u('1496588152823-86ff7695e68f'),u('1522083165195-3424ed129620'),u('1489599849927-2ee91cede3ba'),u('1519389950473-47ba0277781c')]}
];
export const spotlights=[
 {...creatives[0],workingOn:'A portrait series about the people keeping Brooklyn venues alive after midnight.',nextCollab:'A set designer who likes building strange, temporary worlds.'},
 {...creatives[3],workingOn:'A neighborhood type archive built from hand-painted signs across the Bronx.',nextCollab:'An animator who can make letterforms move with personality.'}
];
export const circles=[
 {id:'film-photo',name:'Film Photographers of NYC',description:'A small group for film stocks, darkrooms, photo walks, and honest critique.',tags:['Film','Photography'],memberCount:46,members:[creatives[0],creatives[6],creatives[13]]},
 {id:'motion-design',name:'Motion Designers Circle',description:'Monthly conversations about movement, sound, tools, and works in progress.',tags:['Motion','Design','Video'],memberCount:31,members:[creatives[1],creatives[11],creatives[12]]},
 {id:'fashion-stylists',name:'Fashion Stylists Collective',description:'Reference swaps, sourcing knowledge, and peer support for NYC stylists.',tags:['Fashion','Styling','Editorial'],memberCount:38,members:[creatives[2],creatives[4],creatives[9]]}
];
export const samplePosts=[
 {id:'post-1',circle_id:'film-photo',author_name:'Devon Price',message:'Anyone shooting 35mm around Chinatown this weekend? I want to compare scans after.'},
 {id:'post-2',circle_id:'film-photo',author_name:'Maya Chen',message:'Just finished this editorial — looking for feedback on whether the edit needs one quieter frame.'},
 {id:'post-3',circle_id:'motion-design',author_name:'Noah Feld',message:'Need a PA for a music video Tuesday in Queens. Small crew, late exterior.'},
 {id:'post-4',circle_id:'fashion-stylists',author_name:'Sarah Kim',message:'Looking for a makeup artist for a beauty test Sunday on the Lower East Side.'},
 {id:'post-5',circle_id:'fashion-stylists',author_name:'Talia Brooks',message:'I have a rack of samples available for one test shoot next week — mostly natural fabrics and soft tailoring.'}
];
export const weeklyPrompt={id:'one-color',eyebrow:'This week',title:'Make something using only one color',description:'Shoot, style, draw, or design one piece. Share the constraint and what it unlocked.'};
export const sampleSubmissions=[
 {id:'sample-blue',creator_name:'Maya Chen',creator_image:creatives[0].portrait,file_url:work(0,3),caption:'Blue hour, without correcting the cast.',sampleComment:'The tonal restraint makes the light feel intentional.'},
 {id:'sample-red',creator_name:'Andre Williams',creator_image:creatives[3].portrait,file_url:work(3,1),caption:'A red-only risograph proof.',sampleComment:'The paper texture keeps one color from feeling flat.'}
];
export const sampleMentors=[
 {...creatives[5],mentor_blurb:'I can help with pitching concepts, directing collaborators, and building a clear treatment.'},
 {...creatives[1],mentor_blurb:'Happy to talk through pre-production, small crews, and shaping a reel.'}
];