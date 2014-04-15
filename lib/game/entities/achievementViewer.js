ig.module(
    'game.entities.achievementViewer'
)
    .requires(
    'impact.entity'
).defines(function(){
        EntityAchievementViewer = ig.Entity.extend({

            collection: [],
            background: new ig.Image('media/UI/Achievement_bg.png'),
            bglock: new ig.Image('media/UI/Achievement_item_lock.png'),
            bgunlock: new ig.Image('media/UI/Achievement_item_unlock.png'),
            show: false,

            titleFontGray: new ig.Image('media/Fonts/problemtrigger_gray.png'),
            contentFontGray: new ig.Image('media/Fonts/problemtrigger_gray.png'),
            titleFontWhite: new ig.Image('media/Fonts/problemtrigger_gray.png'),
            contentFontWhite: new ig.Image('media/Fonts/problemtrigger_gray.png'),

            _xbase: 200,
            _ybase: 300,

            zIndex: 99999,

            list:[

                {title: 'Already Started?', content: 'Solve 3 questions'},
                {title: 'Got them all!', content: 'Solve all 5 questions in level 1'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Talking shelf!', content: 'Talk to the bookshelf'},
                {title: 'Pee in game', content: 'Flush the toilet once'}


            ],

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.initAchievement();
                this.initBackButton();

            },

            update: function() {
            },

            add: function(e) {
                this.collection.push(e);

            },

            display: function() {
                if (!this.show) {
                    this.show = true;
                }
            },

            hide: function() {
                if (this.show) {
                    this.show = false;
                }
            },

            draw: function() {
                if (this.show) {
                    this.background.draw(0, 0);
                    for (var i = 1; i <= 8; i++) {
                        var xpos, ypos;
                        xpos = this._xbase;
                        ypos = this._ybase + parseInt(i-1) * 100;
                        var img = null;

                        var title = this.list[i-1].title;
                        var content = this.generateContent(this.list[i-1].content);

                        if (this.collection[i-1]) {
                            img = new ig.Image('media/UI/Achievement_Icon/'+i+'_lock.png');
                            this.bglock.draw(xpos, ypos);
                            this.titleFontGray.draw(title, xpos + 70, ypos + 10);
                            this.contentFontGray.draw(content,xpos + 70, ypos + 35);
                        }
                        else {
                            img = new ig.Image('media/UI/Achievement_Icon/'+i+'_unlock.png');
                            this.bgunlock.draw(xpos, ypos);
                            this.titleFontWhite.draw(title, xpos + 70, ypos + 10);
                            this.contentFontWhite.draw(content, xpos + 70, ypos + 35);
                        }
                        img.draw(xpos, ypos);
                    }
                    ig.gui.element.action('show', 'Button_BackToMainMenu');
                }
            },

            initAchievement: function() {
                for (var i = 0; i < 7; i++) {
                    this.add(ig.game.dataLoader.checkAchievementStatus(i+1));
                }
            },

            initBackButton: function() {
                ig.gui.element.add({
                    name: 'Button_BackToMainMenu',
                    group: 'Group_Achievement',
                    size: {x: 30, y: 30},
                    pos: {x: 814, y: 235},
                    state: {
                        normal: {image: new ig.Image('media/UI/Achievement_btn_leave.png')},
                        hover: {image: new ig.Image('media/UI/Achievement_btn_leave_hover.png')}
                    },
                    click: function() {
                        ig.gui.element.action('hide', 'Button_BackToMainMenu');
                        ig.gui.element.action('showGroup', 'Group_MainMenu');
                        ig.game.getEntitiesByType('EntityAchievementViewer')[0].hide();

                    }
                });
                ig.gui.element.action('hide', 'Button_BackToMainMenu');
            },

            generateContent: function(s) {
                var result = '';
                for (var i = 0; i < s.length; i++) {
                    result += s.charAt(i);
                    if (i > 0 && i % 40 == 0) {

                        if (s.charAt(i+1) == ' ') {
                            i++;
                        }
                        result += '\n';
                    }
                }
                return result;
            }


        });
    });