import os from 'os'

// Function to get the IP address
function getIpAddress() {
    const interfaces = os.networkInterfaces();
    let ipAddress = '';

    // Iterate over interfaces
    Object.keys(interfaces).forEach((iface) => {
        interfaces[iface].forEach((ifaceInfo) => {
            // Skip over non-IPv4 addresses and localhost
            if (ifaceInfo.family === 'IPv4' && !ifaceInfo.internal) {
                ipAddress = ifaceInfo.address;
            }
        });
    });

    return ipAddress;
}

// Example usage:
const ipAddress = getIpAddress();
console.log(`IP Address: ${ipAddress}`);
