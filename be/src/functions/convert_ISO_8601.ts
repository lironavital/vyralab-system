
// Function to parse ISO 8601 duration and convert to total seconds
function convert_ISO_8601_to_seconds(duration: string): number {
    const regex = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
    const matches = duration.match(regex);

    let seconds = 0;

    if (matches) {
        if (matches[1]) {
            const hours = parseInt(matches[1], 10);
            seconds += hours * 3600;  // Convert hours to seconds
        }
        if (matches[2]) {
            const minutes = parseInt(matches[2], 10);
            seconds += minutes * 60;  // Convert minutes to seconds
        }
        if (matches[3]) {
            const secs = parseInt(matches[3], 10);
            seconds += secs;  // Add seconds
        }
    }

    return seconds;
}

export default convert_ISO_8601_to_seconds