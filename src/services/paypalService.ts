import { databases } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite'
import { PayPalPayment } from '@/types/video'

export class PayPalService {
  // Criar um novo pagamento
  static async createPayment(payment: Omit<PayPalPayment, 'id' | 'createdAt'>): Promise<PayPalPayment> {
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.paypalPaymentsCollectionId,
        'unique()',
        {
          ...payment,
          createdAt: new Date().toISOString(),
        }
      )

      return {
        id: response.$id,
        videoId: response.videoId,
        videoTitle: response.videoTitle,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paypalOrderId: response.paypalOrderId,
        paypalPayerId: response.paypalPayerId,
        createdAt: response.createdAt,
        completedAt: response.completedAt,
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      throw error
    }
  }

  // Atualizar status do pagamento
  static async updatePaymentStatus(
    paymentId: string,
    status: PayPalPayment['status'],
    paypalOrderId?: string,
    paypalPayerId?: string
  ): Promise<void> {
    try {
      const updateData: Record<string, unknown> = { status }
      
      if (status === 'completed') {
        updateData.completedAt = new Date().toISOString()
      }
      
      if (paypalOrderId) {
        updateData.paypalOrderId = paypalOrderId
      }
      
      if (paypalPayerId) {
        updateData.paypalPayerId = paypalPayerId
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.paypalPaymentsCollectionId,
        paymentId,
        updateData
      )
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error)
      throw error
    }
  }

  // Obter pagamento por ID
  static async getPayment(paymentId: string): Promise<PayPalPayment | null> {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.paypalPaymentsCollectionId,
        paymentId
      )

      return {
        id: response.$id,
        videoId: response.videoId,
        videoTitle: response.videoTitle,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paypalOrderId: response.paypalOrderId,
        paypalPayerId: response.paypalPayerId,
        createdAt: response.createdAt,
        completedAt: response.completedAt,
      }
    } catch (error) {
      console.error('Erro ao obter pagamento:', error)
      return null
    }
  }

  // Listar pagamentos por vídeo
  static async getPaymentsByVideo(videoId: string): Promise<PayPalPayment[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.paypalPaymentsCollectionId,
        [
          // Filtrar por vídeo
          `videoId=${videoId}`,
          // Ordenar por data de criação (mais recente primeiro)
          'orderDesc(createdAt)'
        ]
      )

      return response.documents.map(doc => ({
        id: doc.$id,
        videoId: doc.videoId,
        videoTitle: doc.videoTitle,
        amount: doc.amount,
        currency: doc.currency,
        status: doc.status,
        paypalOrderId: doc.paypalOrderId,
        paypalPayerId: doc.paypalPayerId,
        createdAt: doc.createdAt,
        completedAt: doc.completedAt,
      }))
    } catch (error) {
      console.error('Erro ao listar pagamentos do vídeo:', error)
      return []
    }
  }
}
