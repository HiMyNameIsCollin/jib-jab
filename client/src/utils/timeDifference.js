function timeDifference(date) {
	const dateNow = new Date()
	const postDate = new Date(date)
    let difference = dateNow.getTime() - postDate.getTime();
    let daysDifference = Math.floor(difference/1000/60/60/24);
    let hoursDifference = Math.floor(difference/1000/60/60);
    let minutesDifference = Math.floor(difference/1000/60);
    let secondsDifference = Math.floor(difference/1000);
   	if(daysDifference < 1){
   		if(hoursDifference < 1){
   			if(minutesDifference < 1){
   				return '1m'
   			} else {
   				return `${minutesDifference}m`
   			}
   		} else if(hoursDifference < 25){
   			return `${hoursDifference}h`
   		}
   	} else {
   		return `${daysDifference}d`
   	}
}

module.exports = timeDifference