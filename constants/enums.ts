// src/constants/enums.ts

export enum OrgRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

export enum ServiceStatus {
    OPERATIONAL = 'OPERATIONAL',
    DEGRADED = 'DEGRADED',
    PARTIAL_OUTAGE = 'PARTIAL_OUTAGE',
    MAJOR_OUTAGE = 'MAJOR_OUTAGE',
}

export enum IncidentStatus {
    INVESTIGATING = 'INVESTIGATING',
    IDENTIFIED = 'IDENTIFIED',
    MONITORING = 'MONITORING',
    RESOLVED = 'RESOLVED',
    SCHEDULED = 'SCHEDULED',
}

export enum UserRole {
    SUPERUSER = 'SUPERUSER',
    USER = 'USER'
}

export enum ServiceType {
    WEBSITE = 'WEBSITE',
    API = 'API',
    DATABASE = 'DATABASE',
    CACHE = 'CACHE',
    STORAGE = 'STORAGE',
    AUTHENTICATION = 'AUTHENTICATION',
    PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
    EMAIL = 'EMAIL',
    CDN = 'CDN',
    BACKEND = 'BACKEND',
    OTHER = 'OTHER'
}