export interface Location {
    id: number;
    name: string;
    lat: number;
    lon: number;
    url: string;
}

export async function allCooridantesForSearch(search: string) {
    var params = new URLSearchParams()
    params.set("q", search)
    params.set("format","json")
    let response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: {
            'User-Agent': 'Journal/1.0 (mail@ax4w.me)'
        }
    })
    const responseText = await response.text();
    console.log("Nominatim API Response Text:", responseText); 

    try {
        return JSON.parse(responseText); 
    } catch (e) {
        console.error("Failed to parse Nominatim response:", e);
        throw new Error(`Nominatim API returned non-JSON response: ${responseText.substring(0, 100)}...`); // Throw a more informative error
    }
}

export async function getLocations() {
    
}