function Camera(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;

    this.inventory = [];
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };
    
    this.rotationRadians;

    this.moveUpDown = "";
    this.moveLeftRight = "";

    this.metadata = {};

    this.moveCamera = function(fieldObject)
    {
        switch (this.moveUpDown) {
            case 'up':
                this.moveForward(fieldObject);
                break;
            case 'down':
                this.moveBackward(fieldObject);
                break;
        }
        switch (this.moveLeftRight) {
            case 'left':
                this.turnLeft();
                break;
            case 'right':
                this.turnRight();
                break;
        }
    };

    this.moveForward = function(fieldObject)
    {
        var newPixelX = this.positionPixelX + Math.cos(this.rotationRadians) * 10;
        var newPixelY = this.positionPixelY + Math.sin(this.rotationRadians) * 10;
        if (fieldObject.isNotHit(this, newPixelX, newPixelY)) {
            this.positionPixelX = newPixelX;
            this.positionPixelY = newPixelY;
        }
    };

    this.moveBackward = function(fieldObject)
    {
        var newPixelX = this.positionPixelX - Math.cos(this.rotationRadians) * 10;
        var newPixelY = this.positionPixelY - Math.sin(this.rotationRadians) * 10;
        if (fieldObject.isNotHit(this, newPixelX, newPixelY)) {
            this.positionPixelX = newPixelX;
            this.positionPixelY = newPixelY;
        }
    };

    this.turnLeft = function()
    {
        this.rotationRadians -= 0.17;
    };

    this.turnRight = function()
    {
        this.rotationRadians += 0.17;
    };
}

function Field()
{
    this.fieldMap;
    this.fieldDetails;
    this.blockSize;
    this.getPosition = function(xPixel, yPixel) {
        var xIndex = Math.ceil(xPixel / this.blockSize);
        var yIndex = Math.ceil(yPixel / this.blockSize);
        if (yIndex > this.fieldMap.length-1 || yIndex < 0 || xIndex > this.fieldMap[0].length-1 || xIndex < 0) {
            return 1;
        } else {
            return this.fieldMap[ yIndex ][ xIndex ];
        }
    };

    this.isNotHit = function(cameraObject, xPixel, yPixel)
    {
        var wall = this.getPosition(xPixel, yPixel);
        var requirement = this.fieldDetails[wall]['requiresKeyId'];

        if (requirement != undefined) {
            var found = false;
            for (var inventoryIndex in cameraObject.inventory) {
                if (cameraObject.inventory[inventoryIndex] == requirement) {
                    found = true;
                    break;
                }
            }

            if (found) {
                var xIndex = Math.ceil(xPixel / this.blockSize);
                var yIndex = Math.ceil(yPixel / this.blockSize);
                this.fieldMap[ yIndex ][ xIndex ] = 0;

                return true;
            }
        } else if (wall == 0) {
            return true;
        }

        return false;
    }
}

function Light(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };
}

function Sprite(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    this.image;
    this.type;
    this.metadata;
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };

    this.activate = function(viewContext, cameraObject, drawObject, raycasterObject, fieldObject)
    {
    }
}

function ItemSprite(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    this.image;
    this.inventoryImage;
    this.type;
    this.metadata = {};
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };

    this.activate = function(viewContext, cameraObject, drawObject, raycasterObject, fieldObject)
    {
        if (this.metadata["pickedUp"] == false) {
            x = this.getPixelX();
            y = this.getPixelY();
            range = this.metadata["range"];
            distance = drawObject.getDistance(x, y, cameraObject.getPixelX(), cameraObject.getPixelY());
            if (distance < range) {
                if (this.metadata['health'] != undefined) {
                    cameraObject.metadata["health"] += this.metadata["health"];
                } else if (this.metadata['keyId'] != undefined) {
                    cameraObject.inventory.push(this.metadata["keyId"]);
                }
                this.metadata["pickedUp"] = true;
                this.inventoryImage = this.image;
                this.image = null;

                var objectiveNumber = this.metadata['objectiveNumber'];
                if (objectiveNumber != undefined && drawObject.objectiveNumber+1 == objectiveNumber) {
                    drawObject.objectiveNumber = objectiveNumber;
                }

                drawObject.flash = "rgba(0,255,0, 0.5)";
            }
        }
    }
}

function EnemySprite(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    this.image;
    this.type;
    this.metadata;
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };

    this.activate = function(viewContext, cameraObject, drawObject, raycasterObject, fieldObject)
    {
        var health = this.metadata["health"];
        if (health > 0) {
            var x = this.getPixelX();
            var y = this.getPixelY();
            var enemyDistance = drawObject.getDistance(x, y, cameraObject.getPixelX(), cameraObject.getPixelY());
            if (enemyDistance < this.metadata["activationRange"]) {
                var angle = drawObject.objectAngle(cameraObject, x, y);
                var actionChance = Math.random();
                if (actionChance < this.metadata["shootChance"]) {
                    var wallDistance = raycasterObject.castRay2(cameraObject, fieldObject, angle);
                    if (enemyDistance < wallDistance[0][1]['realDistance']) {
                        cameraObject.metadata["health"] -= this.metadata["shotDamage"];
                        drawObject.flash = "rgba(255,0,0,0.5)";
                        $('enemy-attack').play();
                    }
                } else {
                    var speed = this.metadata["speed"];
                    var x = this.getPixelX();
                    var y = this.getPixelY();
                    this.move(fieldObject, angle, speed);
                }
            }
        }
    }
    
    this.move = function(fieldObject, rotation, distance)
    {
        rotation = rotation + Math.PI;
    
        if (rotation > 2*Math.PI) {
            rotation -= 2*Math.PI;
        }
        if (rotation < 0) {
            rotation += 2*Math.PI;
        }
        var newX = this.getPixelX() + Math.cos(rotation) * (distance);
        var newY = this.getPixelY() + Math.sin(rotation) * (distance);
        var newXoffset = this.getPixelX() + Math.cos(rotation) * (distance+30);
        var newYoffset = this.getPixelY() + Math.sin(rotation) * (distance+30);
        if (fieldObject.getPosition(newXoffset, newYoffset) == 0 /*&& !doorIsHit(newX, newY)*/) {
            this.setPixelX(newX);
            this.setPixelY(newY);
        }
    }
}

function PortalSprite(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    this.image;
    this.type;
    this.metadata;
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };

    this.activate = function(viewContext, cameraObject, drawObject, raycasterObject, fieldObject)
    {
        var x = this.getPixelX();
        var y = this.getPixelY();
        var range = this.metadata["range"];
        var distance = drawObject.getDistance(x, y, cameraObject.getPixelX(), cameraObject.getPixelY());
        if (distance < range) {
            var toX = this.metadata["toX"];
            var toY = this.metadata["toY"];
            var toAngle = this.metadata["toAngle"];
            if (fieldObject.getPosition(toX, toY) == 0) {
                cameraObject.setPixelX(toX);
                cameraObject.setPixelY(toY);
                cameraObject.rotationRadians = toAngle;
                drawObject.flash = "rgba(0,0,0,1)";
                drawObject.flashDuration = 5;
            }
        }
    }
}

function NpcSprite(fieldObject)
{
    this.blockSize = fieldObject.blockSize;
    this.positionPixelX;
    this.positionPixelY;
    this.image;
    this.type;
    this.metadata;
    
    this.setIndexX = function(x) { this.positionPixelX = x * this.blockSize - (this.blockSize / 2); };
    this.setIndexY = function(y) { this.positionPixelY = y * this.blockSize - (this.blockSize / 2); };
    this.getIndexX = function() { return Math.ceil(this.positionPixelX / this.blockSize); };
    this.getIndexY = function() { return Math.ceil(this.positionPixelY / this.blockSize); };
    
    this.setPixelX = function(x) { this.positionPixelX = x; }; 
    this.setPixelY = function(y) { this.positionPixelY = y; };
    this.getPixelX = function() { return this.positionPixelX; };
    this.getPixelY = function() { return this.positionPixelY; };

    this.activate = function(viewContext, cameraObject, drawObject, raycasterObject, fieldObject)
    {
        var x = this.getPixelX();
        var y = this.getPixelY();
        var range = this.metadata["range"];
        var distance = drawObject.getDistance(x, y, cameraObject.getPixelX(), cameraObject.getPixelY());
        if (distance < range) {
            var message = this.metadata["message"];
            var color = this.metadata["color"];
            var backgroundColor = this.metadata["backgroundColor"];
            drawObject.drawText(viewContext, raycasterObject, message, color, backgroundColor);
        }
    }
}

function Game()
{
    this.minimapContext;
    this.viewContext;
    this.fieldObject;
    this.cameraObject;
    this.raycasterObject;
    this.drawObject;
    this.fullRadiansCycle = 2*Math.PI;

    this.cycle = function() {
        //this.drawObject.lightArray[0].positionPixelY += 1;
        this.cameraObject.moveCamera(this.fieldObject);
        if (this.cameraObject.rotationRadians >= this.fullRadiansCycle) {
            this.cameraObject.rotationRadians -= this.fullRadiansCycle;
        } else if (this.cameraObject.rotationRadians < 0) {
            this.cameraObject.rotationRadians += this.fullRadiansCycle;
        }
        this.drawObject.clearScreen(this.viewContext, this.raycasterObject.viewPixelWidth, this.raycasterObject.viewPixelHeight);
        var wallDistanceArray = this.raycasterObject.castRays(this.cameraObject, this.fieldObject);

        this.drawObject.drawFloor(this.viewContext, this.raycasterObject.viewPixelWidth, this.raycasterObject.halfViewPixelHeight);
        this.drawObject.drawSimpleLight(this.viewContext, this.cameraObject, this.raycasterObject, $('floor'));
        this.drawObject.drawWalls(this.viewContext, this.fieldObject, wallDistanceArray, this.raycasterObject.viewPixelWidth, this.raycasterObject.viewPixelHeight);
       
        this.drawObject.regenerateHealth(this.cameraObject);
        this.drawObject.drawSprites(this.viewContext, this.cameraObject, this.raycasterObject, wallDistanceArray);
        this.drawObject.activateSprites(this.viewContext, this.cameraObject, this.raycasterObject, this.fieldObject);
        this.drawObject.activateFlash(this.viewContext, this.raycasterObject);
        this.drawObject.drawInterface(this.viewContext, this.cameraObject, this.raycasterObject);
        this.drawObject.drawMinimap(this.viewContext, this.minimapContext, this.fieldObject, this.cameraObject);
    };
}

