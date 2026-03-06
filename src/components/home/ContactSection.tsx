import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, MessageCircle, Mail, CheckCircle, Loader2 } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const whatsappMessage = `Olá! Sou ${formData.name} (${formData.email}). ${formData.message}`
    window.open(
      `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank'
    )

    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <section className="py-24" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left side - Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Vamos conversar?
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Tem alguma dúvida ou sugestão? Entre em contato e responderemos o mais rápido possível.
              </p>

              <div className="space-y-3">
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/10">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">Resposta em até 2 horas</div>
                  </div>
                </a>

                <a
                  href="mailto:contato@saraiva.ai"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">E-mail</div>
                    <div className="text-xs text-muted-foreground">contato@saraiva.ai</div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold font-display mb-2">Mensagem enviada!</h3>
                  <p className="text-sm text-muted-foreground">
                    Você será redirecionado para o WhatsApp.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-foreground/80">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-foreground/80">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/50"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-foreground/80">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none text-sm text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensagem
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
