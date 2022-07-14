export default function convertHourstoMinute( time:String ) {
    
    //divide em duas partes
    const [hours, minutes] = time.split(':').map(Number)

    //mutiplica os valores do array e sava na variavel
    const timeInMinutes = (hours*60) + minutes
    
    //retorna a variavel 
    return timeInMinutes;

}