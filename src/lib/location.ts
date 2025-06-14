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
    let response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
    return await response.json()
}

export async function getLocations() {
    
}