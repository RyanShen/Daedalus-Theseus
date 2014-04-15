ig.module(
    'game.classes.dialogController'
)
.requires(
    'impact.system'
)
.defines(function(){


    DialogController = ig.Class.extend({

        dialogSetJSON: null,

        level1_objectInteraction_dialogSet: null,

        name: null,

        dialogBox: null,
        isLoaded: false,

        avatar: null,

        init: function() {

            this.avatar = [
                {   name: 'Nathan',
                    nameCaps: 'NATHAN',
                    nickname: 'Son',
                    child: 'son',
                    thirdSub: 'he',
                    thirdSubCaps: 'He',
                    thirdObj: 'him',
                    thirdPos: 'his',
                    thirdRef: 'himself'
                },
                {
                    name: 'Nathalie',
                    nameCaps: 'NATHALIE',
                    nickname: 'Honey',
                    child: 'daughter',
                    thirdSub: 'she',
                    thirdSubCaps: 'She',
                    thirdObj: 'her',
                    thirdPos: 'her',
                    thirdRef: 'herself'
                },
                {
                    name: 'undefined'
                },
                {
                    name: 'undefined'
                }
            ];

            this.dialogSetJSON= [
                //LEVEL 1
                {id: '1_upperFloor_Question1_Before', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Let\'s see what this flash drive holds..' }
                ]},
                {id: '1_upperFloor_Question2_Before', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There\'s a dusty old hard disk in here.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Hmm.. Looks like it\'s corrupted.. Let\'s see if THESEUS can analyze this.' }
                ]},
                {id: '1_upperFloor_Question2_After', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad\'s diary log.. Let\'s see what\'s in the latest entry' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"Entry #47.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"I have been appointed to lead Project MINO-4..\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"I don\'t have the full details yet but I am excited to start the project.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Hmm.. Project MINO-4.. I wonder what that is..' }
                ]},
                {id: '1_upperFloor_Question3_Before', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Oh there\'s a CD hidden between some books. Let\'s check it out.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Great. It\'s locked. Let\'s hack into it.' }
                ]},
                {id: '1_upperFloor_Question3_After', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There seems to be a picture in it.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'It is kind of blurry.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Wait what\'s this?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There is a word in the image.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"MINO-4\"' }
                ]},
                {id: '1_upperFloor_Question4_Before', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad has a habit of bringing work home from his job at Thyrin Lab.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'These must be some of his blueprints from work..' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Oh?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There\'s a CD here!' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Let\'s load it into THESEUS.' }
                ]},
                {id: '1_upperFloor_Question4_After', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Hmm.. They are just some documents from Dad\'s job.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Mostly stuff related to the medical robots he works on.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Wait. There\'s something else here.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There\'s a folder named \"MINO-4\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Hmm.. It\'s empty. Seems like the contents were deleted.' }
                ]},
                {id: '1_upperFloor_Question5_Before', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad should have some information on his desktop. Let\'s take a look.' }
                ]},
                {id: '1_upperFloor_Question5_After', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There is a bunch of notes on the medical robots he was working on at Thyrin Lab.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There doesn\'t seem to be anything else on his computer.' }
                ]},
                {id: '1_upperFloor_Computer', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Not the time to be using the computer right now.' }
                ]},
                {id: '1_upperFloor_Bookshelf', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Just a bunch of Computer Security books..' }
                ]},
                {id: '1_upperFloor_Bed', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I don\'t feel like sleeping right now.' }
                ]},
                {id: '1_upperFloor_Chair', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'I don\'t think I should be relaxing right now.' }
                ]},
                {id: '1_upperFloor_Photo', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Ah this photo sure brings back some memories.' }
                ]},
                {id: '1_upperFloor_Window', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Nothing unusual outside.' }
                ]},
                {id: '1_upperFloor_Plant', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_genuine, autoprogress: 0, text: 'The plant looks healthy.' }
                ]},
                {id: '1_upperFloor_GreenWindow', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Cool modern window. The house is so much brighter.' }
                ]},
                {id: '1_upperFloor_Bathtub', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'This isn\'t the time for a bath.' }
                ]},
                {id: '1_upperFloor_ToiletBowl', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Somehow I feel like someone\'s watching me right now..' }
                ]},
                {id: '1_upperFloor_Basin', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I shouldn\'t waste water.' }
                ]},
                {id: '1_upperFloor_Dad_Computer', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'It\'s Dad\'s computer.' }
                ]},
                {id: '1_upperFloor_Dad_Bookshelf', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad has a lot of books on robotics.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Looks like he\'s been working on some medical technology.' }
                ]},
                {id: '1_upperFloor_Dad_Closet', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'That\'s Dad\'s closet.' }
                ]},
                {id: '1_upperFloor_Dad_Table', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad has a habit of bringing work home from his job at Thyrin Lab.' }
                ]},
                {id: '1_upperFloor_Dad_Bed', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Dad\'s rarely home cause of work.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'He must really love his job at Thyrin Lab.' }
                ]},
                {id: '1_lowerFloor_Fridge', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I\'m not really hungry right now.' }
                ]},
                {id: '1_lowerFloor_Microwave', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Not really in the mood for microwaveable food.' }
                ]},
                {id: '1_lowerFloor_Oven', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Nothing in there.' }
                ]},
                {id: '1_lowerFloor_Basin', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I shouldn\'t waste water.' }
                ]},
                {id: '1_lowerFloor_Stove', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I always wanted to learn how to cook.' }
                ]},
                {id: '1_lowerFloor_Plant', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_genuine, autoprogress: 0, text: 'The plant looks healthy.' }
                ]},
                {id: '1_lowerFloor_Couch', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Now is not the time to be resting.' }
                ]},
                {id: '1_lowerFloor_Bookshelf', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Dad has some books on robotics here. He really has a passion for it.' }
                ]},
                {id: '1_lowerFloor_Photo', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Hmm.. Where did the photo go?' }
                ]},
                //LEVEL 2
                {id: '2_PoliceHQ_Question6_Before', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'We have some documents here that needs to be cracked. Can you help us?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_sincere, autoprogress: 0, text: 'Sure! Let me take a look.' }
                ]},
                {id: '2_PoliceHQ_Question6_After', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Alright! You did it!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Let\'s see what these documents contain.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Looks like a bunch of files from your Dad\'s work. Nothing related to Project MINO-4.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Hang on.. Look at this line here.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"Daedalus Corp.\"' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Is is that a client of Thyrin Lab\'s?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'I don\'t know.' }
                ]},
                {id: '2_PoliceHQ_Question7_Before', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'We\'re trying to access this hard disk we retrieve from your Dad\'s office.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'It seems to be locked. Can you break into it?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_sincere, autoprogress: 0, text: 'I\'ll give it a shot!' }
                ]},
                {id: '2_PoliceHQ_Question7_After', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Wow great job!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Let\'s see what\'s in here.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'There\'s an email log between your dad and an unknown source.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"James, how is the cyborg coming on. I hope everything is going according to plan.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"MINO-4 is near completion. We\'re working on the latest changes you requested. But are you sure about the changes?\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"You ask too many questions James. Just proceed as you\'re told.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"Yes Sir.\"' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'That\'s the end of the conversation log.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Was it signed by anyone?.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Let me see..' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Yes. \"Daedalus\".' }
                ]},
                {id: '2_PoliceHQ_Question8_Before', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'Hey ' + this.avatar[ig.game.avatarID].name + ', could you help me with this over here?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_sincere, autoprogress: 0, text: 'Sure thing!' }
                ]},
                {id: '2_PoliceHQ_Question8_After', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'Nicely done!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'It\'s an audio log of your dad\'s.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"It\'s Day 82 of the project.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"MINO-4 was due for completion in 2 days but the superiors just made some changes to the blueprints.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"There is something going on here. This wasn\'t what we were supposed to build originally.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"This is dangerous. I better build some kind of kill switch for this. Hope no one finds out.\"' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'What does that mean?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Seems like Dad was talking about the cyborg.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Whatever it is, Dad was working some kind of counter measure for it.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'I wonder if he completed it. Or was he kidnapped because of it!?' }
                ]},
                {id: '2_PoliceHQ_Question9_Before', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: this.avatar[ig.game.avatarID].name + '! Great timing! I need some help over here? Could you give me a hand?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_sincere, autoprogress: 0, text: 'Okay!' }
                ]},
                {id: '2_PoliceHQ_Question9_After', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Perfect!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'It\'s an audio log of your dad\'s.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"It\'s Day 1 of the project.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"The team has just received the blueprints from Daedalus Corp.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"I haven\'t seen it yet but according to the others, it looks like we\'re working on some state-of-the-art technology.\"' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'noside' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: '\"Everyone is excited to start the project.\"' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Looks like there\'s nothing much here.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Hmm.. Daedalus Corp.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman3, autoprogress: 0, text: 'Does that mean something to you?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'I am not sure.' }
                ]},
                {id: '2_PoliceHQ_Question10_Before', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: this.avatar[ig.game.avatarID].name + '! Do you have a moment? I need help cracking this.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_sincere, autoprogress: 0, text: 'Sure I\'ll take a look at it!' }
                ]},
                {id: '2_PoliceHQ_Question10_After', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Great! You did it!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Let\'s see what\'s in here.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Hmm.. What\'s this?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'This is the blueprint of the cyborg!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'Really!? How did you know that?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Oh.. Uhh.. It was just a guess.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'Let\'s see if there is any other clues on the blueprint.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_serious, autoprogress: 0, text: 'There! \"Property of Daedalus Corp\"' }
                ]},
                {id: '2_PoliceHQ_Bookshelf', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'These books belong to the Section Chief. Better not touch them.' }
                ]},
                {id: '2_PoliceHQ_Plant', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_genuine, autoprogress: 0, text: 'This plant looks just like the one we have at home.' }
                ]},
                {id: '2_PoliceHQ_Interrogation_Notes', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Looks like notes from my interrogation that Officer Lisa took just now.' }
                ]},
                {id: '2_PoliceHQ_Interrogation_Mirror', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'This must be where Section Chief Steve was watching me from just now.' }
                ]},
                {id: '2_PoliceHQ_Interrogation_Notes_2', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Notes from the interrogation. Seems like they were watching me for suspicious behavior.' }
                ]},
                {id: '2_PoliceHQ_Interrogation_Policeman', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'I hope you can help us unlock all the evidence we found.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I\'ll do my best!' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman1, autoprogress: 0, text: 'We\'re counting on you!' }
                ]},
                {id: '2_PoliceHQ_Lobby_Policeman', content: [
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'How\'s the evidence thing coming along?' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I\'m working on it.' },
                    { name: 'Policeman', side: 'right' , mediaNum: ig.game.dialogFigures.f_policeman2, autoprogress: 0, text: 'That\'s great. Keep it up kid.' }
                ]},
                {id: '2_PoliceHQ_Lobby_Notes', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'It\'s a log of the people who has entered and exited the building.' }
                ]},
                {id: '2_PoliceHQ_Blackboard', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Let\'s see what\'s written on the board..' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: '\"Project MINO-4\"..' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: '\"Thyrin Lab\"..' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Seems like they know about cyborg too.' },
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_thinking, autoprogress: 0, text: 'Does it have anything to do with the company that Dad works at?' }
                ]},
                {id: '2_PoliceHQ_OfficeSign_1', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'It says, \"Conference Room\".' }
                ]},
                {id: '2_PoliceHQ_OfficeSign_2', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'It says, \"Officer Lisa\".' }
                ]},
                {id: '2_PoliceHQ_OfficeSign_3', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'It says, \"Section Chief Steve\".' }
                ]},
                {id: '2_PoliceHQ_Couch', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I shouldn\'t be resting right now. I have to find out where Dad is.' }
                ]},
                {id: '2_PoliceHQ_Steve_Stuff', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I better not look through Steve\'s stuff.' }
                ]},
                {id: '2_PoliceHQ_Lisa_Stuff', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I better not look through Lisa\'s stuff.' }
                ]},
                {id: '2_PoliceHQ_Case_Notes', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'Case notes. Seems like everyone on this case has a copy.' }
                ]},
                {id: '2_PoliceHQ_Case_Computer', content: [
                    { name: this.avatar[ig.game.avatarID].name, side: 'left' , mediaNum: ig.game.dialogFigures.f_disinterested, autoprogress: 0, text: 'I shouldn\'t be touching the police\'s computers without their permission.' }
                ]}
            ];
        },


        setDialogBox: function() {
            this.dialogBox = ig.game.getEntitiesByType(EntityDialogPlayer)[0];
        },

        // load the dialog according to the event id on trigger - called by interactive object (clickable)
        loadDialog: function (interactionID) {

            var dialogs = null;

            // search for dialog in the dialogSetJSON file
            for (var i = 0; i < this.dialogSetJSON.length; i++) {
                if (this.dialogSetJSON[i].id == interactionID) {
                    dialogs = this.dialogSetJSON[i].content;
                    break;
                }
            }

            if (dialogs != null) {
 //               if (!this.isLoaded) {
                    this.dialogBox.playDialogSet( dialogs );
                    this.isLoaded = true;
 //               }
            }
            else {
                // error handling
                console.log("dialog not found");
                this.isLoaded = false;
            }

        },

        // check if the dialog is loaded and has just ended
        ends: function() {
            if (this.isLoaded && !this.dialogBox.isPlaying) {
                this.isLoaded = false;
                return true;
            }
            return false;
        }
    });

});