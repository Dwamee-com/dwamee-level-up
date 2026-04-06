export type RequestType = 'leave_early' | 'come_late' | 'financial_advance' | 'vacation';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type VacationType = 'annual' | 'sick' | 'personal' | 'unpaid';

export interface Approver {
  id: string;
  name: string;
  role: string;
  status: RequestStatus;
}

export interface BaseRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  createdAt: string;
  approvers: Approver[];
}

export interface LeaveEarlyRequest extends BaseRequest {
  type: 'leave_early';
  date: string;
  leaveTime: string;
  note?: string;
}

export interface ComeLateRequest extends BaseRequest {
  type: 'come_late';
  date: string;
  arrivalTime: string;
  note?: string;
}

export interface FinancialAdvanceRequest extends BaseRequest {
  type: 'financial_advance';
  amount: number;
  reason: string;
  repaymentMonths: number;
}

export interface VacationRequest extends BaseRequest {
  type: 'vacation';
  vacationType: VacationType;
  startDate: string;
  endDate: string;
  days: number;
  deductFromBalance: boolean;
  attachment?: string;
  selectedDates: string[];
}

export type AnyRequest = LeaveEarlyRequest | ComeLateRequest | FinancialAdvanceRequest | VacationRequest;

const approvers: Approver[] = [
  { id: 'a1', name: 'Manager Ali', role: 'Direct Manager', status: 'accepted' },
  { id: 'a2', name: 'HR Sara', role: 'HR Manager', status: 'pending' },
  { id: 'a3', name: 'Director Khalid', role: 'Department Director', status: 'pending' },
];

export const allRequests: AnyRequest[] = [
  // Leave Early
  { id: 'req1', type: 'leave_early', status: 'accepted', createdAt: '2026-03-01', date: '2026-03-01', leaveTime: '15:00', note: 'Doctor appointment', approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },
  { id: 'req2', type: 'leave_early', status: 'pending', createdAt: '2026-03-10', date: '2026-03-10', leaveTime: '14:30', note: 'Family emergency', approvers: [{ ...approvers[0], status: 'accepted' }, approvers[1], approvers[2]] },
  { id: 'req3', type: 'leave_early', status: 'rejected', createdAt: '2026-02-20', date: '2026-02-20', leaveTime: '13:00', approvers: approvers.map(a => ({ ...a, status: a.id === 'a2' ? 'rejected' as RequestStatus : 'accepted' as RequestStatus })) },
  { id: 'req4', type: 'leave_early', status: 'accepted', createdAt: '2026-01-15', date: '2026-01-15', leaveTime: '16:00', note: 'Personal errand', approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },

  // Come Late
  { id: 'req5', type: 'come_late', status: 'accepted', createdAt: '2026-03-02', date: '2026-03-02', arrivalTime: '10:00', note: 'Traffic jam', approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },
  { id: 'req6', type: 'come_late', status: 'pending', createdAt: '2026-03-12', date: '2026-03-12', arrivalTime: '10:30', note: 'Car maintenance', approvers: [{ ...approvers[0], status: 'accepted' }, approvers[1], approvers[2]] },
  { id: 'req7', type: 'come_late', status: 'rejected', createdAt: '2026-02-18', date: '2026-02-18', arrivalTime: '11:00', approvers: approvers.map(a => ({ ...a, status: a.id === 'a1' ? 'rejected' as RequestStatus : 'pending' as RequestStatus })) },

  // Financial Advance
  { id: 'req8', type: 'financial_advance', status: 'pending', createdAt: '2026-03-05', amount: 2000, reason: 'Car repair', repaymentMonths: 3, approvers: [{ ...approvers[0], status: 'accepted' }, approvers[1], approvers[2]] },
  { id: 'req9', type: 'financial_advance', status: 'accepted', createdAt: '2026-01-20', amount: 5000, reason: 'Home renovation', repaymentMonths: 6, approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },

  // Vacations
  { id: 'req10', type: 'vacation', status: 'accepted', createdAt: '2026-02-01', vacationType: 'annual', startDate: '2026-04-10', endDate: '2026-04-17', days: 5, deductFromBalance: true, selectedDates: ['2026-04-10', '2026-04-11', '2026-04-13', '2026-04-14', '2026-04-15'], approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },
  { id: 'req11', type: 'vacation', status: 'pending', createdAt: '2026-03-08', vacationType: 'sick', startDate: '2026-03-20', endDate: '2026-03-22', days: 3, deductFromBalance: false, attachment: 'medical_report.pdf', selectedDates: ['2026-03-20', '2026-03-21', '2026-03-22'], approvers: [{ ...approvers[0], status: 'accepted' }, approvers[1], approvers[2]] },
  { id: 'req12', type: 'vacation', status: 'rejected', createdAt: '2026-01-10', vacationType: 'personal', startDate: '2026-02-01', endDate: '2026-02-05', days: 3, deductFromBalance: true, selectedDates: ['2026-02-01', '2026-02-02', '2026-02-03'], approvers: approvers.map(a => ({ ...a, status: a.id === 'a3' ? 'rejected' as RequestStatus : 'accepted' as RequestStatus })) },
  { id: 'req13', type: 'vacation', status: 'accepted', createdAt: '2025-12-15', vacationType: 'annual', startDate: '2025-12-25', endDate: '2025-12-31', days: 5, deductFromBalance: true, selectedDates: ['2025-12-25', '2025-12-26', '2025-12-28', '2025-12-29', '2025-12-30'], approvers: approvers.map(a => ({ ...a, status: 'accepted' as RequestStatus })) },
];

export function getRequestsByType(type: RequestType): AnyRequest[] {
  return allRequests.filter(r => r.type === type);
}

export function getRequestStats() {
  const leaveEarly = allRequests.filter(r => r.type === 'leave_early').length;
  const comeLate = allRequests.filter(r => r.type === 'come_late').length;
  const financial = allRequests.filter(r => r.type === 'financial_advance').length;
  const vacation = allRequests.filter(r => r.type === 'vacation').length;
  return { leaveEarly, comeLate, financial, vacation, total: allRequests.length };
}
