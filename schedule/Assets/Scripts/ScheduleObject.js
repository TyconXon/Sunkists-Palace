var schedule = {
	/**When I want to, I should probably switch from simple objects to store the hours to more efficient class-derived objects */
	Hour:class{
		constructor(start,end,name){
			this.start = start;
			this.end = end;
			this.name = name;
		}
		
	},
	//{start:[hour,minute],end:[hour,minute],name:"peroid / block"},
}

schedule.globalClasses = {
	normal:{
		lunchPeriod : {start:[11,30],end:[12,10],name:"Obsolete"}, //Lunch
		period4 : {start:[10,46],end:[11,30],name:"Obsolete"}, //Period4
		period6 : {start:[12,10],end:[12,54],name:"Obsolete"}, //Period6
	},
	short:{
		lunchPeriod : {start:[10,42],end:[11,12],name:"Obsolete"}, //LunchForFriday
		period4 : {start:[10,10],end:[10,42],name:"Obsolete"},
		period6 : {start:[11,12],end:[11,44],name:"Obsolete"}, //Period6
	}
}

schedule.PM = {
	normal:[
		{start:[07,30],end:[08,24],name:"Period 1"}, //Period1
		{start:[08,29],end:[09,23],name:"Period 2"}, //Pediod2
		{start:[09,28],end:[10,27],name:"Period 3"}, //Period3
		{start:[10,32],end:[11,25],name:"Period 4"}, //Period4
		{start:[11,30],end:[12,23],name:"Period 5"}, //Pediod5
		{start:[12,28],end:[13,22],name:"Period 6"}, //Period6
		{start:[13,27],end:[14,20],name:"Period 7"}, //Period7
	],
	short:[
		{start:[07,30],end:[08,10],name:"Period 1"}, //Period1
		{start:[08,15],end:[08,55],name:"Period 2"}, //Period2
		{start:[09,00],end:[09,35],name:"DRHS JAG"}, //DRHS JAG
		{start:[09,40],end:[10,20],name:"Period 3"}, //Period3
		{start:[10,25],end:[11,05],name:"Period 4"}, //Period4
		{start:[11,10],end:[11,50],name:"Period 5"}, //Period5
		{start:[11,55],end:[11,35],name:"Period 6"}, //Period6
		{start:[12,40],end:[13,20],name:"Period 7"}, //Period7
	],
};
schedule.AM ={
	normal:[ //AM Block-haver (derogatory)
		{start:[08,20],end:[09,31],name:"Don't use AM" },
		{start:[09,34],end:[10,43],name:"Don't use AM" },
		schedule.globalClasses.normal.period4, //Period4
		schedule.globalClasses.normal.lunchPeriod, //Lunch
		schedule.globalClasses.normal.period6, //Period6
		{start:[12,57],end:[13,41],name:"Don't use AM"},
		{start:[13,44],end:[14,28],name:"Don't use AM"},
	],
	short:[
		{start:[08,20],end:[09,12],name:"Obsolete" },
		{start:[09,15],end:[10,07],name:"Obsolete" },
		schedule.globalClasses.short.period4, //Period4
		schedule.globalClasses.short.lunchPeriod, //Lunch
		schedule.globalClasses.short.period6, //Period6
		{start:[11,47],end:[12,19],name:"Obsolete"},
		{start:[12,12],end:[12,54],name:"Obsolete"},
	],
}
schedule.PERIODS = {
	normal:[
		schedule.PM.normal[1], //Period1
		schedule.PM.normal[2], //Pediod2
		schedule.PM.normal[3], //Period3
		schedule.PM.normal[4], //Period
		schedule.PM.normal[5], //Pediod
		schedule.PM.normal[6], //Period
		schedule.AM.normal[7],
	],
	short:[
		schedule.PM.short[1], //Period1
		schedule.PM.short[2], //Pediod2
		schedule.PM.short[3], //Period3
		schedule.PM.short[4], //Period
		schedule.PM.short[5], //Pediod
		schedule.PM.short[6], //Period
		schedule.AM.short[7],
		schedule.AM.short[8],
	],
}
schedule.BLOCKS ={
	normal:[
		{start:[08,20],end:[09,31],name:"Block 1"},
		{start:[09,34],end:[10,43],name:"Block 2"},
		{start:[10,42],end:[11,12],name:"Lunch"},
		{start:[12,57],end:[14,07],name:"Block 3"}, 
		{start:[14,10],end:[15,20],name:"Block 4"}, 
	],
	short:[
		{start:[08,20],end:[09,12],name:"Block 1"},
		{start:[09,15],end:[10,07],name:"Block 2"},
		schedule.lunchShortPeriod, //Lunch
		{start:[11,47],end:[12,37],name:"Block 3"}, //Block3
		{start:[12,40],end:[13,30],name:"Block 4"}, //Block4
	]
}

/**
 * @kind function
 * @param {string} blockType [AM||PM||BLOCKS||PERIODS], AM or PM blocks, and teacher options.
 * @param {boolean} shortDay Does the day have the same schedule as a friday?
 * @description Gets the current class by genorating the current time and checking lengths
 * @returns 
*/
schedule.getClass = function(blockType, shortDay){
	
	blockType = blockType.toUpperCase();
	
	var currentDate = new Date(); //Use .getHour() & .getMinutes()
	

	if(blockType != "AM" && blockType != "PM" && blockType != "BLOCKS" && blockType != "PERIODS"){
		throw ("Not a valid block type! (AM||PM||BLOCKS||PERIODS), " + blockType + " was chosen instead...");
		return -1;
	}
	if(shortDay == null){
		
		throw("Not a valid day type. (true||false)");
		return -2;
	}

	var ccschedule = schedule.PM;
	

	if(blockType == "AM"){
		ccschedule = schedule.AM; //this style of programming is called "I HATE AM BLOCK PEOPLE"
	}else if(blockType == "BLOCKS"){
		ccschedule = schedule.BLOCKS;
	}else if(blockType == "PERIODS"){
		ccschedule = schedule.PERIODS;
	}
	if(shortDay == true){
		var cschedule = ccschedule.short;
	}else{
		var cschedule = ccschedule.normal;
	}
		
		for(let i = 0; i<=cschedule.length;i++){
			let iPeriod = cschedule[i];

				if(currentDate.getHours() >= iPeriod.start[0]){ //if the current hour is more than the starting hour
					if(currentDate.getHours() <= iPeriod.end[0]){
						if(currentDate.getMinutes() <= iPeriod.end[1]){
							return iPeriod;
						}else if(currentDate.getHours() < iPeriod.end[0]){
							return iPeriod;
						}
					}
				}else if(currentDate.getHours() == iPeriod.start[0]){
					if(currentDate.getMinutes() >= iPeriod.start[1]){
						if(currentDate.getMinutes() <= iPeriod.end[1]){
							return iPeriod;
						}
					}
				}
		}
		//Check failed for all periods; resort to these answers:
		//TODO: CHECK IF IT IS A PASSING PERIOD, BEFORE SCHOOL, OR AFTER SCHOOl
		return {start:[0,0],end:[0,0],name:"PASSING PERIOD, BEFORE SCHOOL, OR AFTER SCHOOL."};

}



//schedule.normal[1].start[0]