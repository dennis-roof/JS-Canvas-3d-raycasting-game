function Raycaster()
{
    this.viewPixelWidth;
    this.halfViewPixelWidth;
    this.viewPixelHeight;
    this.halfViewPixelHeight;
    this.fieldOfVisionRadians;
    this.halfFieldOfVisionRadians;
    this.playerDistance;
    this.angleStep;
    this.fullRadiansCycle;

    this.quadrant1 = 90 * Math.PI / 180;
    this.quadrant2 = 180 * Math.PI / 180;
    this.quadrant3 = 270 * Math.PI / 180;
    this.quadrant4 = 360 * Math.PI / 180;

    this.init = function initializeConstants(fieldObject)
    {
        this.halfViewPixelWidth = this.viewPixelWidth / 2;
        this.halfViewPixelHeight = this.viewPixelHeight / 2;
        this.halfFieldOfVisionRadians = this.fieldOfVisionRadians / 2;
        this.playerDistance = (this.halfViewPixelWidth) / Math.tan(this.halfFieldOfVisionRadians);
        this.normalizeDistanceConstant = fieldObject.blockSize * this.playerDistance * 0.5; // divided in half, somehow looks better
        this.angleStep = this.fieldOfVisionRadians / this.viewPixelWidth;
        this.fullRadiansCycle = 2*Math.PI;
    }

    this.castRays = function(cameraObject, fieldObject)
    {
        var angleOffset = -(this.halfFieldOfVisionRadians);

        var wallDistanceArray = [];

        var count = 0;
        while (angleOffset < this.halfFieldOfVisionRadians) {
            var currentAngle = cameraObject.rotationRadians + angleOffset;
            var realAngle = (currentAngle + this.fullRadiansCycle) % this.fullRadiansCycle;

            var foundWalls = this.castRay2(cameraObject, fieldObject, realAngle);
            var correctedWalls = [];
            for (var wallIndex in foundWalls) {
                var correctedDistance = this.fishEyesCorrection(angleOffset, foundWalls[wallIndex][0]);
                var normalizedDistance = this.normalizeDistance(correctedDistance);

                correctedWalls.push([normalizedDistance, foundWalls[wallIndex][1]]);
            }

            wallDistanceArray.push(correctedWalls);

            angleOffset += this.angleStep;
            count++;
        }


        return wallDistanceArray;
    };

    this.castRay2 = function(cameraObject, fieldObject, angle)
    {
        var x = cameraObject.getPixelX();
        var y = cameraObject.getPixelY();

        var wall = 0;
        var distance = 0;

        /*
         * Definition of up: going down on the map, meaning adding to y
         */

        var angleTan = Math.tan(angle);
       

        var xOffsetLeft = (x % fieldObject.blockSize);
        var yOffsetDown = (y % fieldObject.blockSize);
        var xOffsetRight = fieldObject.blockSize - (x % fieldObject.blockSize);
        var yOffsetUp = fieldObject.blockSize - (y % fieldObject.blockSize);

        var up = (angle > 0 && angle < this.quadrant2);
        var right = (angle < this.quadrant1 || angle > this.quadrant3);

        var wallNumber1 = 0;
        var wallNumber2 = 0;
        var notDone = true;
        
        if (right) {
            var tempX1 = x + xOffsetRight+1;
            var tempY1 = y + ((xOffsetRight)*angleTan);
            var distance1 = Math.sqrt( Math.pow(xOffsetRight+1, 2) + Math.pow((xOffsetRight*angleTan), 2) );
        } else {
            var tempX1 = x - xOffsetLeft;
            var tempY1 = y - ((xOffsetLeft)*angleTan);
            var distance1 = Math.sqrt( Math.pow(xOffsetLeft, 2) + Math.pow((xOffsetLeft*angleTan), 2) );
        }
        
        if (up) {
            tempX2 = x + (yOffsetUp / angleTan);
            tempY2 = y + yOffsetUp+1;
            var distance2 = Math.sqrt( Math.pow((yOffsetUp/angleTan), 2) + Math.pow(yOffsetUp+1, 2) );
        } else {
            tempX2 = x - (yOffsetDown / angleTan);
            tempY2 = y - yOffsetDown;
            var distance2 = Math.sqrt( Math.pow((yOffsetDown/angleTan), 2) + Math.pow(yOffsetDown, 2) );
        }
       
        var xStep = fieldObject.blockSize / angleTan;
        var yStep = fieldObject.blockSize * angleTan;
        var totalDistance1 = distance1;
        var totalDistance2 = distance2;
        var distance1 = Math.sqrt( Math.pow(fieldObject.blockSize, 2) + Math.pow(yStep, 2) );
        var distance2 = Math.sqrt( Math.pow(xStep, 2) + Math.pow(fieldObject.blockSize, 2) );

        var walls = [];
        var wallWasHit = false;
        var hitWallNumber = 0;
        while (notDone) {
            wallNumber1 = fieldObject.getPosition(tempX1, tempY1);
            wallNumber2 = fieldObject.getPosition(tempX2, tempY2);
            if ((wallWasHit || wallNumber1 > 0) && totalDistance1 < totalDistance2) {
                
                if (wallWasHit && wallNumber1 != hitWallNumber) {
                    wallWasHit = false;
                 
                    var wallHeight = fieldObject.fieldDetails[hitWallNumber]['height'];
                    var nextWall = [totalDistance1, {'wall':hitWallNumber, 'x':Math.ceil(tempX1), 'y':Math.ceil(tempY1), 'realDistance':totalDistance1}];
                    walls.unshift(nextWall);
                } else {
                    wallWasHit = true;
                    hitWallNumber = wallNumber1;
                }
                
                if (wallNumber1 > 0) {
                    var wallHeight = fieldObject.fieldDetails[wallNumber1]['height'];
                    var nextWall = [totalDistance1, {'wall':wallNumber1, 'x':Math.ceil(tempX1), 'y':Math.ceil(tempY1), 'realDistance':totalDistance1}];
                    walls.unshift(nextWall);
                }

                if (wallHeight == 1) {
                    notDone = false;
                    continue;
                }
            } else if ((wallWasHit || wallNumber2 > 0) && totalDistance2 < totalDistance1) {
                if (wallWasHit && wallNumber2 != hitWallNumber) {
                    wallWasHit = false;
     
                    var wallHeight = fieldObject.fieldDetails[hitWallNumber]['height'];
                    var nextWall = [totalDistance2, {'wall':hitWallNumber, 'x':Math.ceil(tempX2), 'y':Math.ceil(tempY2), 'realDistance':totalDistance2}];
                    walls.unshift(nextWall);
                } else {
                    wallWasHit = true;
                    hitWallNumber = wallNumber2;
                }
                
                
                if (wallNumber2 > 0) {
                    var wallHeight = fieldObject.fieldDetails[wallNumber2]['height'];
                    var nextWall = [totalDistance2, {'wall':wallNumber2, 'x':Math.ceil(tempX2), 'y':Math.ceil(tempY2), 'realDistance':totalDistance2}];
                    walls.unshift(nextWall);
                }

                if (wallHeight == 1) {
                    notDone = false;
                    continue;
                }
            }

            if (totalDistance1 < totalDistance2) {
                if (right) {
                    tempX1 += fieldObject.blockSize;
                    tempY1 += yStep;
                } else {
                    tempX1 -= fieldObject.blockSize;
                    tempY1 -= yStep;
                }
                totalDistance1 += distance1;
            } else {
                if (up) {
                    tempX2 += xStep;
                    tempY2 += fieldObject.blockSize;
                } else {
                    tempX2 -= xStep;
                    tempY2 -= fieldObject.blockSize;
                }
                totalDistance2 += distance2;
            }
        }

        /*
        if (totalDistance1 < totalDistance2) {
            wall = wallNumber1;
            distance = totalDistance1;
            var finalX = Math.ceil(tempX1);
            var finalY = Math.ceil(tempY1);
        } else {
            wall = wallNumber2;
            distance = totalDistance2;
            var finalX = Math.ceil(tempX2);
            var finalY = Math.ceil(tempY2);
        }
        */

        //return {'distance':distance, 'wall':1, 'x':finalX, 'y':finalY};
        return walls;
    };

    this.normalizeDistanceConstant = null;
    this.normalizeDistance = function(distance) { return this.normalizeDistanceConstant / distance; };

    this.fishEyesCorrection = function(angleOffset, distance) { return distance * Math.cos(angleOffset / (this.fieldOfVisionRadians)); };
}
