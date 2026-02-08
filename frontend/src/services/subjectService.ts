import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

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
    const token = localStorage.getItem('token');
    const response = await axios.get<Subject[]>(`${API_URL}/subjects/`, {
        headers: { Authorization: `Bearer ${token}` },
        params
    });
    return response.data;
};

export const getSubject = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get<Subject>(`${API_URL}/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createSubject = async (subject: SubjectCreate) => {
    const token = localStorage.getItem('token');
    const response = await axios.post<Subject>(`${API_URL}/subjects/`, subject, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateSubject = async (id: number, subject: SubjectUpdate) => {
    const token = localStorage.getItem('token');
    const response = await axios.put<Subject>(`${API_URL}/subjects/${id}`, subject, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteSubject = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Teacher Subject Assignment API calls
export const getTeacherAssignments = async (params?: {
    teacher_id?: number;
    subject_id?: number;
    semester?: number;
    academic_year?: string;
}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get<TeacherSubjectAssignment[]>(`${API_URL}/subjects/assignments/`, {
        headers: { Authorization: `Bearer ${token}` },
        params
    });
    return response.data;
};

export const createTeacherAssignment = async (assignment: TeacherSubjectAssignmentCreate) => {
    const token = localStorage.getItem('token');
    const response = await axios.post<TeacherSubjectAssignment>(
        `${API_URL}/subjects/assignments/`,
        assignment,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const deleteTeacherAssignment = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/subjects/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
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
    const token = localStorage.getItem('token');
    const response = await axios.get<Branch[]>(`${API_URL}/branches/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
