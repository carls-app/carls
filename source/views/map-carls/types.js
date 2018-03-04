// @flow

export type Region = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

export type LatLon = {
    latitude: number,
    longitude: number,
}

export type MarkerT = {
    coordinate: LatLon,
    title: string,
    description: string,
    key: string,
}

export type OutlineT = {
    coordinates: Array<LatLon>,
    key: string,
}

export type Building = {
    accessibility: 'none' | 'wheelchair' | 'unknown',
    address: ?string,
    categories: {
        administrative?: true,
        academic?: true,
        outdoors?: true,
        building?: true,
        'employee-housing'?: true,
        'student-housing'?: true,
        hall?: true,
        parking?: true,
        house?: true,
    },
    center: ?[number, number],
    departments: Array<{href: string, label: string}>,
    description: ?string,
    floors: Array<{href: string, label: string}>,
    id: string,
    name: string,
    offices: Array<{href: string, label: string}>,
    outline: Array<[number, number]>,
    photo: ?string,
}
