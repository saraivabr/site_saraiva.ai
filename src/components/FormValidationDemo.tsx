import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContactModal from './ContactModal';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, Shield, Zap, Users, MessageCircle, ArrowRight } from 'lucide-react';

const FormValidationDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="text-blue-500" size={24} />,
      title: "Validação em Tempo Real",
      description: "Feedback instantâneo enquanto o usuário digita"
    },
    {
      icon: <Shield className="text-green-500" size={24} />,
      title: "Prevenção de Erros",
      description: "Formatação automática e validação inteligente"
    },
    {
      icon: <MessageCircle className="text-purple-500" size={24} />,
      title: "Mensagens Claras",
      description: "Erros explicativos que ajudam o usuário"
    },
    {
      icon: <CheckCircle className="text-emerald-500" size={24} />,
      title: "Confirmação Visual",
      description: "Indicadores claros de sucesso e progresso"
    },
    {
      icon: <Clock className="text-orange-500" size={24} />,
      title: "Redução de Abandono",
      description: "UX otimizada para conversão"
    },
    {
      icon: <Users className="text-indigo-500" size={24} />,
      title: "Acessibilidade",
      description: "Compatível com leitores de tela"
    }
  ];

  const validationStrategies = [
    {
      strategy: "Validação Progressiva",
      description: "Campos são validados conforme são preenchidos",
      status: "active"
    },
    {
      strategy: "Formatação Automática",
      description: "Telefones e outros campos são formatados automaticamente",
      status: "active"
    },
    {
      strategy: "Mensagens Contextuais",
      description: "Erros específicos e sugestões de correção",
      status: "active"
    },
    {
      strategy: "Feedback Visual",
      description: "Ícones e cores indicam status dos campos",
      status: "active"
    },
    {
      strategy: "Prevenção de Spam",
      description: "Validação robusta sem prejudicar UX",
      status: "active"
    }
  ];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            FORMULÁRIO
            <br />
            <span className="bg-black text-white px-4 py-2 inline-block mt-2">
              INTELIGENTE
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de validação que reduz abandono e frustrações
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon}
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Validation Strategies */}
        <motion.div
          className="bg-white rounded-lg p-8 mb-16 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Estratégias de Validação Implementadas
          </h3>
          <div className="space-y-4">
            {validationStrategies.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.strategy}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle size={14} className="mr-1" />
                  Ativo
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto border-2 border-black">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Teste a Experiência
              </CardTitle>
              <p className="text-gray-600">
                Experimente nosso formulário inteligente com validação em tempo real
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white hover:opacity-90 font-bold py-4 px-8 text-lg w-full sm:w-auto"
              >
                Abrir Formulário
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Summary */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            { value: "85%", label: "Menos Abandono" },
            { value: "70%", label: "Menos Erros" },
            { value: "50%", label: "Tempo Reduzido" },
            { value: "95%", label: "Satisfação" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-black text-black mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default FormValidationDemo;