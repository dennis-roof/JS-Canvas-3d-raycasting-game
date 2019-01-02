var game;

function init()
{
    //var newCanvas = createImageCanvas('test', 64, $('wall'));
    var minimap = $('minimap');
    var view = $('view');
    
    var fieldMap = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
    fieldMap.push(    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1]);
    fieldMap.push(    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,1]);
    fieldMap.push(    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,1]);
    fieldMap.push(    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,2,2,2,2,0,0,2,2,2,2,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,2,0,0,2,0,0,2,0,0,2,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,2,0,0,2,0,0,2,0,0,2,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,0,0,5,0,2,0,0,4,0,0,3,0,0,2,0,0,0,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,2,0,0,2,0,0,2,0,0,2,0,1,0,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,2,2,2,2,0,0,2,2,2,2,0,1,0,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1]);
    fieldMap.push(    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);

    var fieldDetails = {
        0 : { 'texture':$('wall'), 'height':0 },
        1 : { 'texture':$('wall'), 'height':1, 'minimapColor':'#993333' },
        2 : { 'texture':$('wall2'), 'height':1, 'minimapColor':'#555555' },
        3 : { 'texture':$('door_red'), 'height':1, 'requiresKeyId':'key_red', 'minimapColor':'#ff9999'},
        4 : { 'texture':$('door_blue'), 'height':1, 'requiresKeyId':'key_blue', 'minimapColor':'#9999ff' },
        5 : { 'texture':$('door_green'), 'height':1, 'requiresKeyId':'key_green', 'minimapColor':'#99ff99' }
    };

    var blockSize = 64;

    var fieldObject = new Field();
    fieldObject.fieldMap = fieldMap;
    fieldObject.fieldDetails= fieldDetails;
    fieldObject.blockSize = blockSize;

    var cameraObject = new Camera(fieldObject);
    cameraObject.setIndexX(18);
    cameraObject.setIndexY(12);
    cameraObject.rotationRadians = 1.5*Math.PI;
    cameraObject.metadata = {'health':100};

    var raycasterObject = new Raycaster();
    raycasterObject.viewPixelWidth = parseInt(view.width);
    raycasterObject.viewPixelHeight = parseInt(view.height);
    raycasterObject.fieldOfVisionRadians = 0.35*Math.PI;
    raycasterObject.init(fieldObject);

    var light = new Light(fieldObject);
    light.setIndexX(18);
    light.setIndexY(12);
    light.range = 600;

    var light2 = new Light(fieldObject);
    light2.setIndexX(16);
    light2.setIndexY(5);
    light2.range = 600;

    var light3 = new Light(fieldObject);
    light3.setIndexX(5);
    light3.setIndexY(5);
    light3.range = 600;

    var light4 = new Light(fieldObject);
    light4.setIndexX(5);
    light4.setIndexY(10);
    light4.range = 600;

    var light5 = new Light(fieldObject);
    light5.setIndexX(10);
    light5.setIndexY(10);
    light5.range = 600;

    var light6 = new Light(fieldObject);
    light6.setIndexX(20);
    light6.setIndexY(2);
    light6.range = 600;

    var ghost1 = new EnemySprite(fieldObject);
    ghost1.setIndexX(13);
    ghost1.setIndexY(2);
    ghost1.image = $('ghost');
    ghost1.type = 'enemy';
    ghost1.metadata = {'activationRange':3*blockSize, 'health':100, 'speed':5, 'shootChance':0.1, 'shotDamage':5, 'minimapColor':'#ff0000'};
    
    var ghost2 = new EnemySprite(fieldObject);
    ghost2.setIndexX(7);
    ghost2.setIndexY(10);
    ghost2.image = $('ghost');
    ghost2.type = 'enemy';
    ghost2.metadata = {'activationRange':3*blockSize, 'health':100, 'speed':5, 'shootChance':0.1, 'shotDamage':5, 'minimapColor':'#ff0000'};
    
    var portal = new PortalSprite(fieldObject);
    portal.setIndexX(2);
    portal.setIndexY(10);
    portal.image = $('portal');
    portal.type = 'portal';
    portal.metadata = {'objectiveNumber':4, 'toX':21*blockSize, 'toY':2*blockSize, 'toAngle':Math.PI, 'range':0.5*blockSize, 'minimapColor':'#0000ff'};
    
    var medkit1 = new ItemSprite(fieldObject);
    medkit1.setIndexX(7);
    medkit1.setIndexY(11);
    medkit1.image = $('health_item');
    medkit1.type = 'item';
    medkit1.metadata = {'health':50, 'pickedUp':false, 'range':0.5*blockSize, 'minimapColor':'#00ff00', 'minimapColor':'#00ff00'};
    
    var npc1 = new NpcSprite(fieldObject);
    npc1.setIndexX(19);
    npc1.setIndexY(2);
    npc1.image = $('ghost_npc');
    npc1.type = 'npc';
    npc1.metadata = {'range':blockSize, 'color':'rgba(170,130,240,0.65)', 'backgroundColor':'rgba(120,180,180,0.2)', 'message':'Thank you for      playing!', 'minimapColor':'#ffffff'};
    
    var npc2 = new NpcSprite(fieldObject);
    npc2.setIndexX(18);
    npc2.setIndexY(12);
    npc2.image = null;
    npc2.type = 'npc';
    npc2.metadata = {'range':blockSize, 'color':'rgba(170,130,240,0.65)', 'backgroundColor':'rgba(120,180,180,0.2)', 'message':'Welcome to the      ghosthunt demo!'};
    
    var npc3 = new NpcSprite(fieldObject);
    npc3.setIndexX(17);
    npc3.setIndexY(10);
    npc3.image = null;
    npc3.type = 'npc';
    npc3.metadata = {'range':blockSize, 'color':'rgba(170,130,240,0.65)', 'backgroundColor':'rgba(120,180,180,0.2)', 'message':'Go to your right   and find the exit portal!'};
    
    var tree = new NpcSprite(fieldObject);
    tree.setIndexX(16);
    tree.setIndexY(5);
    tree.image = $('tree');
    tree.type = 'object';
    tree.metadata = {'minimapColor':'#555555'};

    var tree2 = new EnemySprite(fieldObject);
    tree2.setIndexX(10);
    tree2.setIndexY(6);
    tree2.image = $('tree2');
    tree2.type = 'enemy';
    tree2.metadata = {'activationRange':6*blockSize, 'health':100, 'speed':5, 'shootChance':0.1, 'shotDamage':5, 'minimapColor':'#ff0000'};
    
    var bat = new EnemySprite(fieldObject);
    bat.setIndexX(2);
    bat.setIndexY(10);
    bat.image = $('tree2');
    bat.type = 'enemy';
    bat.metadata = {'activationRange':6*blockSize, 'health':100, 'speed':5, 'shootChance':0.1, 'shotDamage':5, 'minimapColor':'#ff0000'};
    
    var kuerbis = new EnemySprite(fieldObject);
    kuerbis.setIndexX(8);
    kuerbis.setIndexY(5);
    kuerbis.image = $('kuerbis');
    kuerbis.type = 'object';
    kuerbis.metadata = {};

    var gravestone2 = new Sprite(fieldObject);
    gravestone2.setIndexX(5);
    gravestone2.setIndexY(6);
    gravestone2.image = $('gravestone2');
    gravestone2.type = 'object';
    gravestone2.metadata = {'minimapColor':'#555555'};
    
    var gravestone3 = new Sprite(fieldObject);
    gravestone3.setIndexX(7);
    gravestone3.setIndexY(6);
    gravestone3.image = $('gravestone3');
    gravestone3.type = 'object';
    gravestone3.metadata = {'minimapColor':'#555555'};
    
    var gravestone4 = new Sprite(fieldObject);
    gravestone4.setIndexX(6);
    gravestone4.setIndexY(6);
    gravestone4.image = $('gravestone4');
    gravestone4.type = 'object';
    gravestone4.metadata = {'minimapColor':'#555555'};
  
    var gravestone6 = new Sprite(fieldObject);
    gravestone6.setIndexX(5);
    gravestone6.setIndexY(5);
    gravestone6.image = $('gravestone6');
    gravestone6.type = 'object';
    gravestone6.metadata = {'minimapColor':'#555555'};
   
    var gravestone7 = new Sprite(fieldObject);
    gravestone7.setIndexX(6);
    gravestone7.setIndexY(5);
    gravestone7.image = $('gravestone7');
    gravestone7.type = 'object';
    gravestone7.metadata = {'minimapColor':'#555555'};
   
    var gravestone8 = new Sprite(fieldObject);
    gravestone8.setIndexX(7);
    gravestone8.setIndexY(5);
    gravestone8.image = $('gravestone8');
    gravestone8.type = 'object';
    gravestone8.metadata = {'minimapColor':'#555555'};
  
    var key_red = new ItemSprite(fieldObject);
    key_red.setIndexX(12);
    key_red.setIndexY(2);
    key_red.image = $('key_red');
    key_red.type = 'item';
    key_red.metadata = {'keyId':'key_red', 'objectiveNumber':1, 'pickedUp':false, 'range':0.5*blockSize, 'minimapColor':'#00ff00'};
    
    var key_green = new ItemSprite(fieldObject);
    key_green.setIndexX(8);
    key_green.setIndexY(8);
    key_green.image = $('key_green');
    key_green.type = 'item';
    key_green.metadata = {'keyId':'key_green', 'objectiveNumber':3, 'pickedUp':false, 'range':0.5*blockSize, 'minimapColor':'#00ff00'};
    
    var key_blue = new ItemSprite(fieldObject);
    key_blue.setIndexX(13);
    key_blue.setIndexY(10);
    key_blue.image = $('key_blue');
    key_blue.type = 'item';
    key_blue.metadata = {'keyId':'key_blue', 'objectiveNumber':2, 'pickedUp':false, 'range':0.5*blockSize, 'minimapColor':'#00ff00'};

    var drawObject = new Draw();
    drawObject.init(fieldObject, raycasterObject);
    drawObject.floorColor = 'rgb(0,0,35)';
    drawObject.lightArray = [light, light2, light3, light4, light5, light6];
    drawObject.spriteArray = [kuerbis, bat, tree2, gravestone2,gravestone3,gravestone4,gravestone6,gravestone7,gravestone8, tree, portal, ghost1, ghost2, npc1, npc2, npc3, key_red, key_green, key_blue];
    //drawObject.spriteArray = [medkit1];

    game = new Game();
    game.minimapContext = minimap.getContext('2d');
    game.viewContext = view.getContext('2d');
    game.fieldObject = fieldObject;
    game.cameraObject = cameraObject;
    game.raycasterObject = raycasterObject;
    game.drawObject = drawObject;

/*
    var imageSlice = newCanvas.getImageData(10, 0, 1, 64);

    var newImage = game.viewContext.createImageData(1, 200);

    var index = 64 / (newImage.data.length);
    for (var i=0; i < newImage.data.length; i += 4) {
        newImage.data[i] = imageSlice.data[Math.floor(index*i)*4];
        newImage.data[i+1] = imageSlice.data[Math.floor(index*i)*4+1];
        newImage.data[i+2] = imageSlice.data[Math.floor(index*i)*4+2];
        newImage.data[i+3] = imageSlice.data[Math.floor(index*i)*4+3];
    }

    game.viewContext.fillRect(10, 10, 5, 100);
    game.viewContext.putImageData(newImage, 20, 20);
    game.viewContext.putImageData(imageSlice, 21, 20);
*/
    window.setInterval('cycle()', 1000 / frameRatePerSecond);
    //cycle();
}

var frameRatePerSecond = 20;
var frame = 0;
var time = 0;
function cycle()
{
    var timeStart = new Date();
    game.cycle();
    var timeEnd = new Date();
    time += (timeEnd.getTime() - timeStart.getTime());
    frame += 1;

    if (frame % 60 == 0) {
        myLog('fps: ' + (frame / (time/1000)));
    }
}

document.onkeydown = function(e)
{
    if (e.keyCode == 87) {
        game.cameraObject.moveUpDown = "up";
    }
    if (e.keyCode == 83) {
        game.cameraObject.moveUpDown = "down";
    }
    if (e.keyCode == 65) {
        game.cameraObject.moveLeftRight = "left";
    }
    if (e.keyCode == 68) {
        game.cameraObject.moveLeftRight = "right";
    }
    if (e.keyCode == 70) {
        $('player-attack').play();
        game.drawObject.shootSprite(game.cameraObject);
    }
}

document.onkeyup = function(e)
{
    if (e.keyCode == 87 || e.keyCode == 83) {
        game.cameraObject.moveUpDown = "";
    }
    if (e.keyCode == 65 || e.keyCode == 68) {
        game.cameraObject.moveLeftRight = "";
    }
}

