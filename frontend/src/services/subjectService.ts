import api from './api';

export interface Subject {
    id: number;
    code: string;
    name: string;
    semester: number;
    branch_id: number | null;
    credits: number;
    max_marks: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export interface SubjectCreate {
    code: string;
    name: string;
    semester: number;
    branch_id?: number | null;
    credits?: number;
    max_marks?: number;
    description?: string | null;
    is_active?: boolean;
}

export interface SubjectUpdate {
    code?: string;
    name?: string;
    semester?: number;
    branch_id?: number | null;
    credits?: number;
    max_marks?: number;
    description?: string | null;
    is_active?: boolean;
}

export interface TeacherSubjectAssignment {
    id: number;
    teacher_id: number;
    subject_id: number;
    semester: number;
    section: string;
    academic_year: string;
    assigned_at: string;
}

export interface TeacherSubjectAssignmentCreate {
    teacher_id: number;
    subject_id: number;
    semester: number;
    section: string;
    academic_year: string;
}

// Subject API calls
export const getSubjects = async (params?: {
    semester?: number;
    branch_id?: number;
    is_active?: boolean;
}) => {
    const response = await api.get<Subject[]>('/api/v1/subjects/', {
        params
    });
    return response.data;
};

export const getSubject = async (id: number) => {
    const response = await api.get<Subject>(`/api/v1/subjects/${id}`);
    return response.data;
};

export const createSubject = async (subject: SubjectCreate) => {
    const response = await api.post<Subject>('/api/v1/subjects/', subject);
    return response.data;
};

export const updateSubject = async (id: number, subject: SubjectUpdate) => {
    const response = await api.put<Subject>(`/api/v1/subjects/${id}`, subject);
    return response.data;
};

export const deleteSubject = async (id: number) => {
    await api.delete(`/api/v1/subjects/${id}`);
};

// Teacher Subject Assignment API calls
export const getTeacherAssignments = async (params?: {
    teacher_id?: number;
    subject_id?: number;
    semester?: number;
    academic_year?: string;
}) => {
    const response = await api.get<TeacherSubjectAssignment[]>('/api/v1/subjects/assignments/', {
        params
    });
    return response.data;
};

export const createTeacherAssignment = async (assignment: TeacherSubjectAssignmentCreate) => {
    const response = await api.post<TeacherSubjectAssignment>(
        '/api/v1/subjects/assignments/',
        assignment
    );
    return response.data;
};

export const deleteTeacherAssignment = async (id: number) => {
    await api.delete(`/api/v1/subjects/assignments/${id}`);
};

// Branch interface (for subject management UI)
export interface Branch {
    id: number;
    name: string;
    code: string;
    description?: string;
}

// Get all branches
export const getBranches = async () => {
    const response = await api.get<Branch[]>('/api/v1/branches/');
    return response.data;
};
