import type { TransferHistoryRecord } from "./types";

export abstract class TransferHistoryFormatter {
  /**
   * Transfer history response formatı
   */
  static response(data: TransferHistoryRecord) {
    return {
      id: data.id,
      studentId: data.studentId,
      oldClassId: data.oldClassId,
      newClassId: data.newClassId,
      notes: data.notes || undefined,
      transferDate: data.transferDate,
      createdAt: data.createdAt,
      student: {
        id: data.student.id,
        name: data.student.name,
        studentNo: data.student.studentNo,
      },
      oldClass: {
        id: data.oldClass.id,
        name: data.oldClass.name,
      },
      newClass: {
        id: data.newClass.id,
        name: data.newClass.name,
      },
    };
  }

  /**
   * Transfer history listesi formatı
   */
  static listResponse(transfers: TransferHistoryRecord[]) {
    return transfers.map((transfer) => this.response(transfer));
  }

  /**
   * Basit transfer kaydı formatı (özet için)
   */
  static summaryResponse(data: TransferHistoryRecord) {
    return {
      id: data.id,
      studentName: data.student.name,
      studentNo: data.student.studentNo,
      oldClassName: data.oldClass.name,
      newClassName: data.newClass.name,
      transferDate: data.transferDate,
      notes: data.notes || undefined,
    };
  }

  /**
   * Özet listesi formatı
   */
  static summaryListResponse(transfers: TransferHistoryRecord[]) {
    return transfers.map((transfer) => this.summaryResponse(transfer));
  }

  /**
   * Delete response formatı
   */
  static deleteResponse() {
    return {
      message: "Transfer kaydı başarıyla silindi",
    };
  }

  /**
   * İstatistik formatı
   */
  static statsResponse(data: {
    totalTransfers: number;
    recentTransfers: TransferHistoryRecord[];
    classStats?: { [classId: string]: number };
  }) {
    return {
      totalTransfers: data.totalTransfers,
      recentTransfers: this.summaryListResponse(data.recentTransfers),
      classStats: data.classStats || {},
    };
  }
}
