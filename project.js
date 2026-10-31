    // ===== PARTICLES BACKGROUND =====
    const container = document.getElementById('particles');
    const particleColors = ['#7c3aed', '#2563eb', '#06b6d4', '#a78bfa', '#60a5fa'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        background:${particleColors[Math.floor(Math.random() * particleColors.length)]};
        animation-duration:${Math.random() * 18 + 14}s;
        animation-delay:${Math.random() * 10}s;
        box-shadow:0 0 ${size * 2}px currentColor;
      `;
      container.appendChild(p);
    }

    // ===== ALL 14 PROJECTS DATA =====
    const PROJECTS_DATA = [
      {
        id: 0,
        demoId: 'demo-student-system',
        slug: 'student-management',
        emoji: '🗄️',
        titleAr: 'نظام إدارة الطلاب',
        titleEn: 'Student Management & Database System',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        category: 'قواعد بيانات & برمجة C++',
        year: '2025 – 2026',
        desc: 'نظام متكامل لإدارة شؤون الطلاب والبيانات الأكاديمية والدرجات مبني بهندسة OOP قوية وقاعدة بيانات SQL محكمة. يوفر النظام سرعة استجابة فائقة، تقارير إحصائية فورية، وبحثاً ذكياً مع ميزات التحقق من سلامة البيانات وعلاقات الجداول.',
        features: [
          { icon: '⚡', title: 'هندسة كائنية (OOP) متينة', desc: 'مبني بلغة C++ مع تطبيق مفاهيم Encapsulation و Inheritance و Polymorphism لضمان قابلية الصيانة والتوسع.' },
          { icon: '🗄️', title: 'محرك استعلامات SQL فعال', desc: 'جداول مهيكلة بروابط Foreign Keys ومؤشرات Indexing لتحقيق أقصى سرعة في عمليات البحث والفرز.' },
          { icon: '📊', title: 'حساب المعدلات والتقديرات آلياً', desc: 'نظام لحساب الـ GPA وتوزيع الدرجات الأكاديمية ونسب النجاح وإصدار تقارير الأداء الفورية.' },
          { icon: '🛡️', title: 'التحقق ومنع الأخطاء Data Validation', desc: 'فلاتر دقيقة لمنع تكرار أرقام القيد الأكاديمية والتحقق من صحة نطاقات المعدل والدرجات.' },
          { icon: '🔍', title: 'بحث وتصفية متعددة المعايير', desc: 'إمكانية البحث بالاسم أو الرقم أو التخصص الأكاديمي مع دعم التصفية المباشرة الفورية.' },
          { icon: '💾', title: 'تصدير وحفظ البيانات File I/O', desc: 'دعم حفظ السجلات واسترجاعها من وإلى ملفات خارجية بطريقة آمنة وسريعة.' }
        ],
        tech: [
          { icon: '⚙️', name: 'C++', role: 'لغة البرمجة الأساسية والـ Backend' },
          { icon: '🗄️', name: 'SQL & Relational DB', role: 'تصميم هيكل البيانات والاستعلامات' },
          { icon: '🧩', name: 'OOP Architecture', role: 'البرمجة كائنية التوجه والتصميم' },
          { icon: '📁', name: 'File Streams & I/O', role: 'نظام التخزين المؤقت والدائم' },
          { icon: '📈', name: 'Data Structures', role: 'خوارزميات الفرز والبحث السريع' }
        ],
        codeFile: 'StudentDatabase.cpp',
        code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>

class Student {
private:
    int id;
    std::string name;
    std::string major;
    double gpa;

public:
    Student(int sId, std::string sName, std::string sMajor, double sGpa)
        : id(sId), name(sName), major(sMajor), gpa(sGpa) {}

    int getId() const { return id; }
    std::string getName() const { return name; }
    std::string getMajor() const { return major; }
    double getGpa() const { return gpa; }

    std::string getGrade() const {
        if (gpa >= 3.7) return "امتياز مع مرتبة الشرف (A+)";
        if (gpa >= 3.0) return "جيد جداً (B+)";
        if (gpa >= 2.0) return "جيد (C)";
        return "مقبول (D)";
    }
};`,
        metrics: [
          { val: '1,450+', lbl: 'أسطر برمجية (C++ & SQL)' },
          { val: '100%', lbl: 'سلامة البيانات والدقة' },
          { val: '< 2ms', lbl: 'سرعة استعلامات البحث' },
          { val: 'A+', lbl: 'جودة الكود المعماري' }
        ]
      },
      {
        id: 1,
        demoId: 'demo-ai-chatbot',
        slug: 'ai-chatbot',
        emoji: '🤖',
        titleAr: 'AI Chatbot بالعربي',
        titleEn: 'Arabic NLP Conversational AI Bot',
        status: 'wip',
        statusText: '⚡ جاري التطوير · In Progress',
        category: 'ذكاء اصطناعي & معالجة لغات (NLP)',
        year: '2025 – 2026',
        desc: 'بوت محادثة ذكي مطور بلغة Python يعتمد على تقنيات معالجة اللغات الطبيعية (Natural Language Processing) المخصصة للغة العربية. يستطيع البوت تحليل نوايا المستخدمين، استخلاص المعنى الدلالي، والرد بذكاء وسلاسة على الأسئلة التقنية والعامة.',
        features: [
          { icon: '🧠', title: 'معالجة النصوص العربية NLP', desc: 'تنظيف النصوص وتجذير الكلمات وإزالة علامات التشكيل وحروف الزيادة.' },
          { icon: '🎯', title: 'تصنيف النوايا (Intent Classification)', desc: 'خوارزمية ذكية للتعرف على هدف المستخدم وتوجيهه للإجابة الأكثر دقة وملاءمة.' },
          { icon: '💬', title: 'سياق المحادثة متعدد الأدوار', desc: 'تتبع سياق الحوار المستمر عبر الجلسة لتقديم إجابات مترابطة ومنطقية.' },
          { icon: '⚡', title: 'زمن استجابة فائق في أجزاء من الثانية', desc: 'محرك بحث متوازي واسترجاع معرفي سريع يضمن تفاعل طبيعي وفوري.' }
        ],
        tech: [
          { icon: '🐍', name: 'Python 3.11', role: 'تطوير نماذج وخوارزميات المعالجة' },
          { icon: '📜', name: 'NLTK & Regex', role: 'معالجة النصوص وتجزئة الكلمات' },
          { icon: '🤖', name: 'Machine Learning', role: 'تصنيف النوايا واستخراج المعنى' }
        ],
        codeFile: 'arabic_nlp_bot.py',
        code: `import re
from typing import Tuple

class ArabicNLPEngine:
    def __init__(self):
        self.intents = {
            "greetings": ["أهلا", "مرحبا", "سلام"],
            "ai_inquiry": ["ذكاء", "اصطناعي", "خوارزمية"],
            "skills": ["مهارات", "بايثون", "برمجة"]
        }

    def detect_intent(self, user_query: str) -> Tuple[str, float]:
        cleaned = re.sub(r'[\u064B-\u0652]', '', user_query).lower()
        for intent, kws in self.intents.items():
            if any(kw in cleaned for kw in kws):
                return intent, 0.96
        return "general", 0.70`,
        metrics: [
          { val: '95.4%', lbl: 'دقة تصنيف النوايا' },
          { val: '< 60ms', lbl: 'سرعة المعالجة اللغوية' },
          { val: '10+', lbl: 'مجالات معرفية مدعومة' },
          { val: 'Beta', lbl: 'حالة النموذج الحالي' }
        ]
      },
      {
        id: 2,
        demoId: 'demo-portfolio',
        slug: 'portfolio-website',
        emoji: '🌐',
        titleAr: 'Portfolio Website',
        titleEn: 'Modern Glassmorphism Portfolio & CV',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        category: 'تطوير الويب فرونت إند',
        year: '2026',
        desc: 'موقع سيرة ذاتية وبورتفوليو شخصي مصمم بأحدث معايير الويب العصرية (Dark Futuristic Theme). يعتمد الموقع على نظام Glassmorphism مع حركات وتفاعلات بصرية مميزة، وجسيمات متحركة، ومساعد AI clone مدمج لإبهار الزوار.',
        features: [
          { icon: '✨', title: 'تصميم Glassmorphism داكن متطور', desc: 'تناغم بصري عالي الدقة يجمع بين التدرجات اللونية الحيوية وتأثيرات الشفافية.' },
          { icon: '📱', title: 'تجاوب كامل 100% (Responsive)', desc: 'تخطيط مرن يعتمد على CSS Grid و Flexbox لكافة أحجام الشاشات.' },
          { icon: '🤖', title: 'مساعد AI Clone تفاعلي مدمج', desc: 'نافذة محادثة ذكية تجيب فورياً على أسئلة أصحاب العمل والزوار.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML5 Semantic', role: 'هيكلة الصفحة بمعايير الـ SEO' },
          { icon: '🎨', name: 'Modern CSS3', role: 'تصميم Glassmorphism والـ Animations' },
          { icon: '⚡', name: 'Vanilla JavaScript', role: 'المنطق التفاعلي والتنقل السريع' }
        ],
        codeFile: 'styles.css (Glassmorphism Tokens)',
        code: `:root {
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255, 255, 255, 0.04);
  --gradient-main: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
}`,
        metrics: [
          { val: '100/100', lbl: 'أداء Lighthouse' },
          { val: '0 deps', lbl: 'خالي من أي مكاتب ثقيلة' },
          { val: '< 0.4s', lbl: 'سرعة التحميل الكامل' },
          { val: '100%', lbl: 'تجاوب مع الهواتف' }
        ]
      },
      {
        id: 3,
        demoId: 'demo-face-recognition',
        slug: 'face-recognition-attendance',
        emoji: '👁️',
        titleAr: 'نظام التعرف على الوجوه والحضور الذكي',
        titleEn: 'AI Face Recognition & Attendance System',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        category: 'رؤية حاسوبية (Computer Vision) & AI',
        year: '2025 – 2026',
        desc: 'نظام رؤية حاسوبية متقدم يعتمد على مكتبات OpenCV ونماذج Deep Learning (Facenet / Dlib) للتعرف الفوري على الوجوه عبر الكاميرا، والتحقق من بصمة الوجه البيومترية، وتسجيل الحضور والانصراف تلقائياً في قاعدة البيانات مع كشف الانفعالات واليقظة.',
        features: [
          { icon: '📷', title: 'كشف وتتبع الوجوه اللحظي (Real-time Detection)', desc: 'معالجة إطارات الفيديو بسرعة 60 إطار بالثانية ورسم الإحداثيات وتحديد الوجه بدقة فائقة.' },
          { icon: '🧬', title: 'بصمة الوجه الرقمية (128D Face Embeddings)', desc: 'استخراج متجهات بيومترية فريدة لكل وجه ومقارنتها عبر المسافة الإقليدية (Euclidean Distance).' },
          { icon: '🛡️', title: 'مقاومة التزييف والخداع (Anti-Spoofing)', desc: 'خوارزمية ذكية لكشف وميض العين وحركة الرأس لمنع استخدام صور ثابتة أو شاشات للتزييف.' },
          { icon: '📝', title: 'تسجيل الحضور التلقائي في قاعدة البيانات', desc: 'حفظ لحظي لساعة الحضور والاسم ونسبة التطابق مع واجهة تصدير لملفات Excel و PDF.' }
        ],
        tech: [
          { icon: '🐍', name: 'Python', role: 'تطوير خط أنابيب المعالجة والتعرف البيومتري' },
          { icon: '📷', name: 'OpenCV', role: 'التقاط الإطارات ومعالجة الصور وتتبع الوجوه' },
          { icon: '🧠', name: 'Dlib & Facenet', role: 'استخراج ميزات الوجه والشبكات العصبية العميقة' },
          { icon: '🗄️', name: 'SQLite / SQL', role: 'تخزين بيانات الطلاب والموظفين وسجلات الحضور' }
        ],
        codeFile: 'face_attendance_engine.py',
        code: `import cv2
import face_recognition
import numpy as np

class AttendanceFaceScanner:
    def __init__(self, known_encodings, known_names):
        self.known_encodings = known_encodings
        self.known_names = known_names

    def process_frame(self, frame):
        # تصغير الإطار لتسريع المعالجة
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        results = []
        for encoding, loc in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(self.known_encodings, encoding, tolerance=0.5)
            distances = face_recognition.face_distance(self.known_encodings, encoding)
            best_idx = np.argmin(distances)

            name = "Unknown"
            confidence = 1.0 - distances[best_idx]
            if matches[best_idx] and confidence > 0.65:
                name = self.known_names[best_idx]

            results.append({"name": name, "confidence": confidence, "box": loc})
        return results`,
        metrics: [
          { val: '99.4%', lbl: 'دقة التعرف على الوجه' },
          { val: '< 15ms', lbl: 'زمن المعالجة لكل إطار' },
          { val: '60 FPS', lbl: 'معدل الإطارات الفعلي' },
          { val: '0.01%', lbl: 'معدل الخطأ الزائف (FAR)' }
        ]
      },
      {
        id: 4,
        demoId: 'demo-real-estate',
        slug: 'real-estate-prediction',
        emoji: '📈',
        titleAr: 'نموذج التنبؤ بأسعار العقارات وتحليل البيانات',
        titleEn: 'Real Estate Price Prediction & ML Analytics',
        status: 'done',
        statusText: '✓ مكتمل · Done',
        category: 'تعلم آلي (Machine Learning) & علم بيانات',
        year: '2025 – 2026',
        desc: 'نموذج تعلم آلي متطور مبني بخوارزميات Multiple Linear Regression و Random Forest للتنبؤ بأسعار الوحدات السكنية في القاهرة بدقة عالية بناءً على الموقع والمساحة وعدد الغرف ومستوى التشطيب ومؤشرات السوق.',
        features: [
          { icon: '📊', title: 'تنظيف وهندسة الميزات (Feature Engineering)', desc: 'معالجة القيم المفقودة، إزالة القيم الشاذة (Outliers)، والترميز الفئوي للمناطق والأحياء.' },
          { icon: '🤖', title: 'خوارزميات انحدار متعددة المقارنة', desc: 'تدريب واختبار Ridge Regression و Random Forest Regressor لاختيار النموذج صاحب أدنى RMSE.' },
          { icon: '📈', title: 'لوحة تفاعلية فورية لتقدير الأسعار', desc: 'حساب فوري لقيمة العقار وسعر المتر المربع وتحديد هامش الخطأ الإحصائي.' },
          { icon: '💡', title: 'تحليل أوزان التأثير (Feature Importance)', desc: 'تحديد العوامل الأكثر تأثيراً في رفع القيمة السوقية للعقار للمستثمرين والمشترين.' }
        ],
        tech: [
          { icon: '🐍', name: 'Python', role: 'تطوير النموذج وتدريب الخوارزميات' },
          { icon: '🔬', name: 'Scikit-Learn', role: 'خوارزميات الانحدار والتقييم الإحصائي' },
          { icon: '🐼', name: 'Pandas & NumPy', role: 'تنظيف البيانات وتحليل الجداول الرياضية' },
          { icon: '📊', name: 'Matplotlib & Seaborn', role: 'رسم المخططات البيانية وتوزيعات الأسعار' }
        ],
        codeFile: 'housing_price_predictor.py',
        code: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

class HousingModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)

    def train(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(X_train, y_train)
        preds = self.model.predict(X_test)
        print(f"R² Score: {r2_score(y_test, preds):.3f}")
        return r2_score(y_test, preds)

    def predict_price(self, area, rooms, district_weight, finish_mult):
        features = np.array([[area, rooms, district_weight, finish_mult]])
        base_estimate = self.model.predict(features)[0]
        return round(base_estimate, -3)`,
        metrics: [
          { val: '93.8%', lbl: 'دقة التنبؤ (R² Score)' },
          { val: '< 5%', lbl: 'متوسط نسبة الخطأ (MAPE)' },
          { val: '15,000+', lbl: 'سجل عقاري تم تدريبه' },
          { val: '0.02s', lbl: 'زمن التنبؤ اللحظي' }
        ]
      },
      {
        id: 5,
        demoId: 'demo-medical-ai',
        slug: 'ai-medical-diagnosis',
        emoji: '🩺',
        titleAr: 'مساعد التشخيص الطبي بالذكاء الاصطناعي',
        titleEn: 'AI Medical Diagnosis & Chest X-Ray Vision',
        status: 'wip',
        statusText: '⚡ جاري التطوير · In Progress',
        category: 'ذكاء اصطناعي طبي (Healthcare AI & CNN)',
        year: '2026',
        desc: 'نظام تشخيص طبي مساعد للأطباء يعتمد على الشبكات العصبية الالتفافية العميقة (Convolutional Neural Networks - ResNet50) لتحليل صور الأشعة السينية لمنطقة الصدر واكتشاف الالتهابات الرئوية والتليف تلقائياً، مع توليد خرائط حرارية (Grad-CAM) توضح البؤر المشتبه بها.',
        features: [
          { icon: '🩻', title: 'تحليل دقيق للأشعة السينية (X-Ray Classification)', desc: 'تصنيف الصور بدقة سريرية عالية والتمييز بين الحالات السليمة والالتهابات الرئوية.' },
          { icon: '🔥', title: 'الخريطة الحرارية البصرية (Grad-CAM Explainability)', desc: 'تحديد المناطق الدقيقة التي استند إليها نموذج الذكاء الاصطناعي لدعم قرار الطبيب.' },
          { icon: '⚡', title: 'تقرير تشخيصي فوري في ثوانٍ', desc: 'إصدار تقرير طبي تلقائي يوضح نسبة الاحتمالية والتوصية بالإجراءات السريرية التالية.' },
          { icon: '🔒', title: 'مراعاة خصوصية وأمان بيانات المرضى', desc: 'إزالة البيانات التعريفية (De-identification) لضمان سرية السجلات الصحية.' }
        ],
        tech: [
          { icon: '🔥', name: 'PyTorch / Torchvision', role: 'بناء وتدريب الشبكات الالتفافية ResNet و DenseNet' },
          { icon: '🐍', name: 'Python', role: 'هندسة خط أنابيب معالجة الصور الطبية' },
          { icon: '🖼️', name: 'Albumentations & OpenCV', role: 'تعزيز البيانات الطبية وتطبيع الإضاءة والتباين' },
          { icon: '⚡', name: 'FastAPI Microservice', role: 'توفير واجهة سريعة لاستقبال الصور وإرجاع التحليل' }
        ],
        codeFile: 'medical_xray_cnn.py',
        code: `import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

class ChestXRayClassifier(nn.Module):
    def __init__(self, num_classes=3):
        super(ChestXRayClassifier, self).__init__()
        # استخدام ResNet50 كنموذج مدرب مسبقاً (Transfer Learning)
        self.backbone = models.resnet50(pretrained=True)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

    def generate_gradcam(self, x):
        """توليد الخريطة الحرارية Grad-CAM للمناطق المؤثرة في التشخيص"""
        # Feature map gradients extraction logic
        pass`,
        metrics: [
          { val: '96.2%', lbl: 'حساسية الاكتشاف (Sensitivity)' },
          { val: '97.8%', lbl: 'نوعية الفحص (Specificity)' },
          { val: '18ms', lbl: 'زمن الفحص للصورة' },
          { val: 'AUC 0.98', lbl: 'منحنى أداء النموذج الطبي' }
        ]
      },
      {
        id: 6,
        demoId: 'demo-portfolio',
        slug: 'responsive-portfolio',
        emoji: '📱',
        titleAr: 'موقع شخصي (Portfolio) متجاوب',
        titleEn: 'Responsive Personal Portfolio',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'تطوير واجهات الويب',
        year: '2026',
        desc: 'موقع تعريفي متجاوب مع الشاشات المختلفة، يضم أقساماً للمهارات والمشاريع والتواصل مع حركات وتأثيرات سلسة. هذا المشروع يشارك معاينة البورتفوليو الحالية.',
        features: [
          { icon: '📱', title: 'توافق مع الشاشات', desc: 'تخطيط مرن للعرض على الهاتف والكمبيوتر.' },
          { icon: '🧭', title: 'أقسام واضحة', desc: 'عرض المهارات والمشاريع ووسائل التواصل.' },
          { icon: '✨', title: 'تفاعلات سلسة', desc: 'حركات انتقال وتأثيرات بصرية للواجهة.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة محتوى الصفحات' },
          { icon: '🎨', name: 'CSS', role: 'تنسيق متجاوب وتأثيرات بصرية' },
          { icon: '⚡', name: 'JavaScript', role: 'التفاعلات وسلوك الواجهة' }
        ],
        codeFile: 'responsive-layout.css',
        code: `.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 600px) {
  .portfolio-header {
    flex-direction: column;
  }
}`,
        metrics: [
          { val: 'Responsive', lbl: 'التصميم' },
          { val: 'HTML', lbl: 'بنية الصفحة' },
          { val: 'CSS', lbl: 'الواجهة' },
          { val: 'JavaScript', lbl: 'التفاعل' }
        ]
      },
      {
        id: 7,
        demoId: 'demo-store',
        slug: 'ecommerce-store',
        emoji: '🛍️',
        titleAr: 'متجر إلكتروني',
        titleEn: 'Interactive E-commerce Store',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'تطوير الويب والتجارة الإلكترونية',
        year: '2026',
        desc: 'واجهة متجر إلكتروني تعرض منتجات تجريبية مع فلترة حسب القسم والسعر وسلة مشتريات تحفظ محتوياتها محلياً في المتصفح.',
        features: [
          { icon: '🛒', title: 'سلة مشتريات', desc: 'إضافة المنتجات ومراجعة الكميات والإجمالي.' },
          { icon: '🔎', title: 'البحث والفلترة', desc: 'تصفية المنتجات حسب القسم والسعر.' },
          { icon: '💾', title: 'حفظ محلي', desc: 'الاحتفاظ بالسلة في LocalStorage على الجهاز.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة واجهة المتجر' },
          { icon: '🎨', name: 'CSS', role: 'تصميم المنتجات والسلة' },
          { icon: '⚡', name: 'JavaScript', role: 'البحث والفلترة وإدارة السلة' },
          { icon: '💾', name: 'LocalStorage', role: 'حفظ السلة في المتصفح' }
        ],
        codeFile: 'cart.js',
        code: `function addToCart(cart, product) {
  const item = cart.find(entry => entry.id === product.id);
  if (item) item.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('store-cart', JSON.stringify(cart));
  return cart;
}`,
        metrics: [
          { val: 'Products', lbl: 'عرض المنتجات' },
          { val: 'Filters', lbl: 'بحث وفلترة' },
          { val: 'Cart', lbl: 'سلة المشتريات' },
          { val: 'Local', lbl: 'حفظ بالمتصفح' }
        ]
      },
      {
        id: 8,
        demoId: 'demo-todo',
        slug: 'todo-app',
        emoji: '✅',
        titleAr: 'تطبيق إدارة المهام',
        titleEn: 'Daily To-do App',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'تطبيقات الويب والإنتاجية',
        year: '2026',
        desc: 'تطبيق لإدارة المهام اليومية يدعم الإضافة والتعديل والحذف وتحديد الأولوية، ويحفظ قائمة المهام في LocalStorage.',
        features: [
          { icon: '➕', title: 'إدارة المهام', desc: 'إضافة المهام وتعديلها وحذفها من القائمة.' },
          { icon: '🎯', title: 'تحديد الأولوية', desc: 'اختيار أولوية لكل مهمة.' },
          { icon: '💾', title: 'حفظ تلقائي', desc: 'استعادة المهام بعد تحديث الصفحة من المتصفح.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة التطبيق' },
          { icon: '🎨', name: 'CSS', role: 'تنسيق قائمة المهام' },
          { icon: '⚡', name: 'JavaScript', role: 'إدارة المهام والتفاعلات' },
          { icon: '💾', name: 'LocalStorage', role: 'حفظ المهام محلياً' }
        ],
        codeFile: 'tasks.js',
        code: `function saveTasks(tasks) {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

function addTask(tasks, title, priority) {
  return [...tasks, {
    id: crypto.randomUUID(),
    title,
    priority,
    done: false
  }];
}`,
        metrics: [
          { val: 'Create', lbl: 'إضافة مهام' },
          { val: 'Edit', lbl: 'تعديل المهام' },
          { val: 'Priority', lbl: 'الأولويات' },
          { val: 'Local', lbl: 'حفظ بالمتصفح' }
        ]
      },
      {
        id: 9,
        demoId: 'demo-weather',
        slug: 'weather-app',
        emoji: '🌦️',
        titleAr: 'تطبيق الطقس',
        titleEn: 'City Weather Forecast',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'تطبيقات الويب وواجهات API',
        year: '2026',
        desc: 'تطبيق للبحث عن حالة الطقس في المدن وعرض درجة الحرارة والرطوبة وتوقعات الأيام القادمة باستخدام خدمة الطقس والبحث الجغرافي من Open-Meteo.',
        features: [
          { icon: '🔎', title: 'البحث عن مدينة', desc: 'العثور على المدينة ثم جلب توقعاتها من خدمة الطقس.' },
          { icon: '🌡️', title: 'بيانات الطقس', desc: 'عرض درجة الحرارة والرطوبة الحالية.' },
          { icon: '📅', title: 'توقعات الأيام القادمة', desc: 'عرض ملخص الطقس ودرجات الحرارة اليومية.' }
        ],
        tech: [
          { icon: '⚡', name: 'JavaScript Fetch', role: 'طلب البيانات من واجهة الطقس' },
          { icon: '🌍', name: 'Open-Meteo API', role: 'البحث الجغرافي وتوقعات الطقس' },
          { icon: '🌐', name: 'HTML & CSS', role: 'عرض حالة الطقس والتوقعات' }
        ],
        codeFile: 'weather.js',
        code: `const response = await fetch(
  'https://api.open-meteo.com/v1/forecast?' +
  new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto'
  })
);
if (!response.ok) throw new Error('Weather request failed');
const forecast = await response.json();`,
        metrics: [
          { val: 'Search', lbl: 'البحث عن المدن' },
          { val: 'Current', lbl: 'الطقس الحالي' },
          { val: '5 Days', lbl: 'توقعات الطقس' },
          { val: 'API', lbl: 'مصدر البيانات' }
        ]
      },
      {
        id: 10,
        demoId: 'demo-ai-chatbot',
        slug: 'website-ai-assistant',
        emoji: '💬',
        titleAr: 'مساعد الموقع بالذكاء الاصطناعي',
        titleEn: 'AI Website Visitor Assistant',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'ذكاء اصطناعي وواجهات API',
        year: '2026',
        desc: 'مساعد ذكي للزوار للإجابة عن الأسئلة حول المهارات والمشاريع. يتصل بـ Gemini من خلال API على Vercel حتى تظل مفاتيح الخدمة في الخادم.',
        features: [
          { icon: '💬', title: 'محادثة مع الزوار', desc: 'إرسال الأسئلة واستقبال الإجابات داخل الموقع.' },
          { icon: '🛡️', title: 'حماية مفاتيح الخدمة', desc: 'تمرير الطلبات عبر API على الخادم بدلاً من تضمين المفتاح في المتصفح.' },
          { icon: '📚', title: 'أسئلة الموقع', desc: 'الإجابة عن معلومات السيرة الذاتية والمشاريع المنشورة.' }
        ],
        tech: [
          { icon: '🤖', name: 'Gemini API', role: 'توليد الردود للمحادثة' },
          { icon: '▲', name: 'Vercel Functions', role: 'استضافة API وحماية المفاتيح' },
          { icon: '⚡', name: 'JavaScript', role: 'واجهة المحادثة وإرسال الطلبات' }
        ],
        codeFile: 'api/chat.js',
        code: `const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages, assistant: 'portfolio' })
});
if (!response.ok) {
  throw new Error('تعذر الاتصال بالمساعد');
}
const { reply } = await response.json();`,
        metrics: [
          { val: 'Chat', lbl: 'واجهة محادثة' },
          { val: 'API', lbl: 'خدمة خلفية' },
          { val: 'Secure', lbl: 'مفتاح بالخادم' },
          { val: 'Gemini', lbl: 'نموذج الذكاء الاصطناعي' }
        ]
      },
      {
        id: 11,
        demoId: 'demo-dashboard',
        slug: 'interactive-dashboard',
        emoji: '📊',
        titleAr: 'لوحة تحكم تفاعلية',
        titleEn: 'Interactive Analytics Dashboard',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'واجهات البيانات والتصور البصري',
        year: '2026',
        desc: 'لوحة تحكم بتصميم واضح لعرض الإحصائيات والرسوم البيانية التفاعلية. معاينة الصفحة تستخدم مجموعة بيانات توضيحية قابلة للتبديل.',
        features: [
          { icon: '📈', title: 'مؤشرات إحصائية', desc: 'عرض بطاقات تلخص المؤشرات الرئيسية.' },
          { icon: '📊', title: 'رسوم تفاعلية', desc: 'استعراض قيم البيانات عبر مخطط قابل للتبديل.' },
          { icon: '🗓️', title: 'تغيير الفترة', desc: 'التبديل بين مجموعات بيانات توضيحية لفترات مختلفة.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة عناصر لوحة التحكم' },
          { icon: '🎨', name: 'CSS', role: 'تنسيق البطاقات والمخططات' },
          { icon: '⚡', name: 'JavaScript', role: 'تحديث البيانات والتفاعل مع الرسم' }
        ],
        codeFile: 'dashboard.js',
        code: `function renderBars(values, container) {
  container.replaceChildren(...values.map(value => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = value + '%';
    bar.setAttribute('aria-label', value + '%');
    return bar;
  }));
}`,
        metrics: [
          { val: 'Stats', lbl: 'مؤشرات' },
          { val: 'Charts', lbl: 'رسوم تفاعلية' },
          { val: 'Filters', lbl: 'فترات عرض' },
          { val: 'Demo', lbl: 'بيانات توضيحية' }
        ]
      },
      {
        id: 12,
        demoId: 'demo-lumina',
        demoUrl: 'projects/lumina/index.html',
        slug: 'lumina-tech-store',
        emoji: '🎧',
        titleAr: 'متجر Lumina للإلكترونيات',
        titleEn: 'Lumina Premium Tech Store',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'تجارة إلكترونية وواجهات ويب',
        year: '2026',
        desc: 'واجهة متجر إلكتروني عصرية لمنتجات التقنية، مرفقة بصورة سماعة Lumina Elite. تتضمن المعاينة قائمة منتجات وفلاتر وسلة تجريبية تحفظ بياناتها محلياً؛ لا يوجد دفع إلكتروني أو طلبات حقيقية.',
        features: [
          { icon: '🎧', title: 'واجهة متجر متناسقة', desc: 'صفحة متجر مستقلة بتصميم فاتح وصورة رئيسية مرفقة.' },
          { icon: '🔎', title: 'تصفية المنتجات', desc: 'عرض المنتجات حسب فئات المتجر.' },
          { icon: '🛒', title: 'سلة مشتريات محلية', desc: 'إضافة المنتجات وتعديل الكميات وحفظ السلة بهذا المتصفح.' },
          { icon: '🧪', title: 'تجربة توضيحية', desc: 'الأسعار والمنتجات تجريبية، ولا تتم أي عملية دفع.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة صفحة المتجر' },
          { icon: '🎨', name: 'CSS', role: 'تنسيق المتجر والبطاقات' },
          { icon: '⚡', name: 'JavaScript', role: 'المنتجات والفلاتر والسلة' },
          { icon: '💾', name: 'LocalStorage', role: 'حفظ السلة محلياً' }
        ],
        codeFile: 'projects/lumina/script.js',
        code: `function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem('lumina-cart', JSON.stringify(cart));
  renderCart();
}`,
        metrics: [
          { val: 'Catalog', lbl: 'كتالوج تجريبي' },
          { val: 'Filters', lbl: 'فئات المنتجات' },
          { val: 'Cart', lbl: 'سلة محلية' },
          { val: 'No Payment', lbl: 'لا توجد مدفوعات' }
        ]
      },
      {
        id: 13,
        demoId: 'demo-portfolio-backup',
        demoUrl: 'projects/portfolio-backup/index.html',
        slug: 'personal-portfolio-backup',
        emoji: '👨‍💻',
        titleAr: 'Portfolio شخصي — نسخة إضافية',
        titleEn: 'Personal Portfolio (Alternate Version)',
        status: 'new',
        statusText: 'مشروع جديد',
        category: 'مواقع شخصية وتصميم متجاوب',
        year: '2026',
        desc: 'نسخة مستقلة باللغة الإنجليزية من موقع Portfolio، تضم أقسام النبذة والمهارات والتعليم والتواصل، مع الصورة الشخصية المرفقة وتأثيرات وتنسيق متجاوب.',
        features: [
          { icon: '👤', title: 'نبذة شخصية', desc: 'قسم تعريفي وهدف مهني ضمن صفحة مستقلة.' },
          { icon: '🧰', title: 'المهارات والتعليم', desc: 'أقسام لعرض المهارات والخلفية التعليمية كما في الملفات المرفقة.' },
          { icon: '📱', title: 'تصميم متجاوب', desc: 'واجهة تتكيف مع أحجام الشاشات المختلفة.' },
          { icon: '✨', title: 'تفاعلات واجهة', desc: 'قائمة تنقل للجوال وتمرير سلس وتأثيرات ظهور أثناء التصفح.' }
        ],
        tech: [
          { icon: '🌐', name: 'HTML', role: 'هيكلة أقسام Portfolio' },
          { icon: '🎨', name: 'CSS', role: 'التصميم والتجاوب والحركات' },
          { icon: '⚡', name: 'JavaScript', role: 'القائمة والتنقل والتأثيرات' }
        ],
        codeFile: 'projects/portfolio-backup/script.js',
        code: `document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});`,
        metrics: [
          { val: 'Responsive', lbl: 'تصميم متجاوب' },
          { val: 'Sections', lbl: 'أقسام تعريفية' },
          { val: 'Motion', lbl: 'تأثيرات تمرير' },
          { val: 'Standalone', lbl: 'صفحة مستقلة' }
        ]
      }
    ];

    // ===== SAMPLE STUDENTS DATA FOR SYSTEM DEMO =====
    let studentsList = [
      { id: 240101, name: 'محمد علاء الدين سيد', major: 'ذكاء اصطناعي', level: 'المستوى الثاني', gpa: 3.92 },
      { id: 240102, name: 'أحمد محمود إبراهيم', major: 'علوم حاسب', level: 'المستوى الثالث', gpa: 3.85 },
      { id: 240103, name: 'سارة خالد المنشاوي', major: 'ذكاء اصطناعي', level: 'المستوى الثاني', gpa: 3.95 },
      { id: 240104, name: 'عمر شريف الدسوقي', major: 'نظم معلومات', level: 'المستوى الرابع', gpa: 3.40 },
      { id: 240105, name: 'نور الدين مصطفى', major: 'علوم حاسب', level: 'المستوى الأول', gpa: 3.50 }
    ];

    // Current active project index.
    let currentProjectIndex = 0;

    // ===== RENDER PROJECT FUNCTION =====
    function renderProject(index) {
      currentProjectIndex = index;
      const p = PROJECTS_DATA[index];
      document.title = `${p.titleAr} | Mohamed Alaa El-Din`;

      // Update Hero Content
      document.getElementById('breadcrumbTitle').textContent = p.titleAr;
      document.getElementById('heroIcon').textContent = p.emoji;
      document.getElementById('heroTitleAr').textContent = p.titleAr;
      document.getElementById('heroTitleEn').textContent = p.titleEn;
      document.getElementById('heroCategory').textContent = p.category;
      document.getElementById('heroYear').textContent = p.year;
      document.getElementById('heroDesc').textContent = p.desc;
      const standaloneLink = document.getElementById('openProjectDemo');
      standaloneLink.style.display = p.demoUrl ? 'inline-flex' : 'none';
      standaloneLink.href = p.demoUrl || '#';

      const statusEl = document.getElementById('heroStatus');
      statusEl.className = 'status-pill ' + p.status;
      statusEl.textContent = p.statusText;

      // Show the preview associated with this project's unique demo identifier.
      document.querySelectorAll('[data-project-demo]').forEach(demo => {
        demo.style.display = demo.dataset.projectDemo === p.demoId
          ? (demo.id === 'demo-ai-chatbot' ? 'flex' : 'block')
          : 'none';
      });

      // Render Features
      const featuresGrid = document.getElementById('featuresCardsGrid');
      featuresGrid.innerHTML = p.features.map(f => `
        <div class="feature-card-item">
          <div class="feature-icon-badge">${f.icon}</div>
          <div class="feature-item-title">${f.title}</div>
          <div class="feature-item-desc">${f.desc}</div>
        </div>
      `).join('');

      // Render Tech Badges
      const techContainer = document.getElementById('techStackPills');
      techContainer.innerHTML = p.tech.map(t => `
        <div class="tech-pill-card">
          <span class="tech-pill-icon">${t.icon}</span>
          <div>
            <div class="tech-pill-name">${t.name}</div>
            <div class="tech-pill-role">${t.role}</div>
          </div>
        </div>
      `).join('');

      // Render Code Box
      document.getElementById('codeFileName').textContent = p.codeFile;
      document.getElementById('codeContentPre').innerHTML = `<code>${escapeHtml(p.code)}</code>`;

      // Render Metrics
      document.getElementById('metric1Val').textContent = p.metrics[0].val;
      document.getElementById('metric1Lbl').textContent = p.metrics[0].lbl;
      document.getElementById('metric2Val').textContent = p.metrics[1].val;
      document.getElementById('metric2Lbl').textContent = p.metrics[1].lbl;
      document.getElementById('metric3Val').textContent = p.metrics[2].val;
      document.getElementById('metric3Lbl').textContent = p.metrics[2].lbl;
      document.getElementById('metric4Val').textContent = p.metrics[3].val;
      document.getElementById('metric4Lbl').textContent = p.metrics[3].lbl;

      // Update Footer Next / Prev
      const prevIdx = (index - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
      const nextIdx = (index + 1) % PROJECTS_DATA.length;
      document.getElementById('prevProjTitle').textContent = PROJECTS_DATA[prevIdx].titleAr;
      document.getElementById('nextProjTitle').textContent = PROJECTS_DATA[nextIdx].titleAr;
      document.getElementById('prevProjCard').href = `project.html?id=${prevIdx}#project-${prevIdx}`;
      document.getElementById('nextProjCard').href = `project.html?id=${nextIdx}#project-${nextIdx}`;

      // Update URL hash / query without reloading
      if (history.replaceState) {
        history.replaceState(null, null, `?id=${index}#project-${index}`);
      }
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // ===== STUDENT SYSTEM DEMO LOGIC =====
    function renderStudentsTable(listToRender) {
      const tbody = document.getElementById('studentsTableBody');
      const list = listToRender || studentsList;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">لا توجد نتائج مطابقة لبحثك.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(s => {
        let gradeClass = 'grade-a';
        let gradeText = 'امتياز';
        if (s.gpa < 3.0) { gradeClass = 'grade-c'; gradeText = 'جيد'; }
        else if (s.gpa < 3.7) { gradeClass = 'grade-b'; gradeText = 'جيد جداً'; }

        return `
          <tr>
            <td style="font-family:'Fira Code', monospace; color:#38bdf8;">#${s.id}</td>
            <td style="font-weight:700; color:var(--text-primary);">${s.name}</td>
            <td><span style="background:rgba(255,255,255,0.05); padding:3px 8px; border-radius:6px;">${s.major}</span></td>
            <td>${s.level}</td>
            <td style="font-family:'Outfit', monospace; font-weight:800; color:#f59e0b;">${Number(s.gpa).toFixed(2)}</td>
            <td><span class="table-grade-badge ${gradeClass}">${gradeText}</span></td>
            <td>
              <button class="btn-del-student" onclick="deleteStudent(${s.id})">حذف</button>
            </td>
          </tr>
        `;
      }).join('');

      const total = studentsList.length;
      document.getElementById('statTotalStudents').textContent = total;
      if (total > 0) {
        const sum = studentsList.reduce((acc, curr) => acc + curr.gpa, 0);
        const avg = (sum / total).toFixed(2);
        const top = Math.max(...studentsList.map(s => s.gpa)).toFixed(2);
        document.getElementById('statAvgGpa').textContent = avg;
        document.getElementById('statTopGpa').textContent = top;
      }
    }

    function filterStudentsTable() {
      const q = document.getElementById('studentSearchInput').value.trim().toLowerCase();
      const major = document.getElementById('majorFilterSelect').value;

      const filtered = studentsList.filter(s => {
        const matchesQuery = s.name.toLowerCase().includes(q) || String(s.id).includes(q);
        const matchesMajor = (major === 'all') || (s.major === major);
        return matchesQuery && matchesMajor;
      });

      renderStudentsTable(filtered);
    }

    function deleteStudent(id) {
      studentsList = studentsList.filter(s => s.id !== id);
      filterStudentsTable();
      showSqlLog(`DELETE FROM students WHERE id = ${id}; [1 row deleted]`);
    }

    function openAddStudentModal() {
      document.getElementById('addStudentModal').classList.add('open');
    }

    function closeAddStudentModal() {
      document.getElementById('addStudentModal').classList.remove('open');
    }

    function submitNewStudent() {
      const name = document.getElementById('newStudentName').value.trim();
      const major = document.getElementById('newStudentMajor').value;
      const level = document.getElementById('newStudentLevel').value;
      const gpa = parseFloat(document.getElementById('newStudentGpa').value);

      if (!name) { alert('يرجى إدخال اسم الطالب'); return; }
      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) { alert('يرجى إدخال معدل صحيح بين 0 و 4.0'); return; }

      const nextId = 240100 + studentsList.length + 1;
      const newStudent = { id: nextId, name, major, level, gpa };
      studentsList.unshift(newStudent);

      closeAddStudentModal();
      document.getElementById('newStudentName').value = '';
      document.getElementById('newStudentGpa').value = '';
      renderStudentsTable();
      showSqlLog(`INSERT INTO students (id, name, major, level, gpa) VALUES (${nextId}, '${name}', '${major}', '${level}', ${gpa}); [Success]`);
    }

    function runSqlPreset(type) {
      if (type === 'all') {
        document.getElementById('majorFilterSelect').value = 'all';
        document.getElementById('studentSearchInput').value = '';
        renderStudentsTable(studentsList);
        showSqlLog('SELECT * FROM students ORDER BY id ASC; [' + studentsList.length + ' rows returned]');
      } else if (type === 'honor') {
        const honorList = studentsList.filter(s => s.gpa >= 3.7);
        renderStudentsTable(honorList);
        showSqlLog(`SELECT * FROM students WHERE gpa >= 3.7; [${honorList.length} honor students found]`);
      } else if (type === 'ai') {
        document.getElementById('majorFilterSelect').value = 'ذكاء اصطناعي';
        filterStudentsTable();
        showSqlLog("SELECT * FROM students WHERE major = 'ذكاء اصطناعي'; [Filtered successfully]");
      } else if (type === 'count') {
        const counts = {};
        studentsList.forEach(s => counts[s.major] = (counts[s.major] || 0) + 1);
        const logStr = Object.entries(counts).map(([m, c]) => `${m}: ${c}`).join(' | ');
        showSqlLog(`SELECT major, COUNT(*) FROM students GROUP BY major; -> [${logStr}]`);
      }
    }

    function showSqlLog(msg) {
      const consoleEl = document.getElementById('sqlConsoleOutput');
      consoleEl.textContent = '> SQL Query: ' + msg;
      consoleEl.style.color = '#38bdf8';
    }

    // ===== AI CHATBOT =====
    const demoChatHistory = [];
    let demoChatSending = false;

    async function sendDemoChatMessage() {
      const input = document.getElementById('demoChatInput');
      const text = input.value.trim();
      if (!text || demoChatSending) return;
      demoChatSending = true;
      input.value = '';
      document.querySelector('.chatbot-send-btn').disabled = true;
      addDemoMsg(text, 'user-row');
      demoChatHistory.push({ role: 'user', text });
      document.getElementById('botIntentBadge').textContent = 'جارٍ التواصل مع Gemini...';
      try {
        const reply = await requestAIResponse(demoChatHistory.slice(-12), 'arabic-demo');
        demoChatHistory.push({ role: 'model', text: reply });
        document.getElementById('botIntentBadge').textContent = 'مساعد Gemini الذكي · جاهز للرد';
        addDemoMsg(reply, 'ai-row');
      } catch (error) {
        demoChatHistory.pop();
        document.getElementById('botIntentBadge').textContent = 'تعذر الاتصال بالمساعد';
        addDemoMsg(error.message || 'تعذر الاتصال بالمساعد الذكي. حاول مرة أخرى.', 'ai-row');
      } finally {
        demoChatSending = false;
        document.querySelector('.chatbot-send-btn').disabled = false;
        input.focus();
      }
    }

    function addDemoMsg(text, rowClass) {
      const area = document.getElementById('demoChatMessages');
      const div = document.createElement('div');
      div.className = 'bot-msg-row ' + rowClass;
      const bubble = document.createElement('div');
      bubble.className = 'bot-msg-bubble';
      bubble.textContent = text;
      div.appendChild(bubble);
      area.appendChild(div);
      area.scrollTop = area.scrollHeight;
    }

    function demoQuickSend(text) {
      document.getElementById('demoChatInput').value = text;
      sendDemoChatMessage();
    }

    // ===== PORTFOLIO DEMO LOGIC =====
    function setMockupDevice(dev) {
      const box = document.getElementById('mockupFrameBox');
      document.getElementById('devBtnDesktop').classList.toggle('active', dev === 'desktop');
      document.getElementById('devBtnTablet').classList.toggle('active', dev === 'tablet');
      document.getElementById('devBtnMobile').classList.toggle('active', dev === 'mobile');

      box.classList.remove('tablet', 'mobile');
      if (dev === 'tablet') box.classList.add('tablet');
      if (dev === 'mobile') box.classList.add('mobile');
    }

    // ===== FACE RECOGNITION DEMO LOGIC =====
    const SUBJECTS = [
      { name: 'محمد علاء الدين سيد', role: 'طالب AI · رقم القيد: 240101', emoji: '👨‍💻', tag: 'MOHAMED ALAA · 99.2%', conf: 99.2, status: 'معتمد ✓', emotion: 'Focused & Confident 😊' },
      { name: 'م. أحمد محمود', role: 'مهندس برمجيات · معيد', emoji: '👨‍🏫', tag: 'ENG. AHMED · 97.4%', conf: 97.4, status: 'معتمد ✓', emotion: 'Attentive & Calm 😐' },
      { name: 'سارة خالد المنشاوي', role: 'طالبة AI · رقم القيد: 240103', emoji: '👩‍💻', tag: 'SARA KHALED · 98.6%', conf: 98.6, status: 'معتمد ✓', emotion: 'Smiling & Alert ✨' },
      { name: 'شخص غير معروف (Unknown)', role: 'غير مسجل في قاعدة البيانات', emoji: '👤', tag: 'UNKNOWN PERSON · 34.0%', conf: 34.0, status: 'مرفوض ✕', emotion: 'Unrecognized Face ❓' }
    ];
    let currentSubjectIdx = 0;

    function cycleSubjectPerson() {
      currentSubjectIdx = (currentSubjectIdx + 1) % SUBJECTS.length;
      const s = SUBJECTS[currentSubjectIdx];
      document.getElementById('faceSubjectEmoji').textContent = s.emoji;
      document.getElementById('faceTargetTag').textContent = s.tag;
      document.getElementById('detectedPersonName').textContent = s.name;
      document.getElementById('detectedPersonRole').textContent = s.role;
      document.getElementById('faceConfidenceVal').textContent = s.conf.toFixed(1) + '%';
      document.getElementById('faceConfidenceBar').style.width = s.conf + '%';
      document.getElementById('faceEmotionVal').textContent = s.emotion;

      const statTag = document.getElementById('attendanceStatusTag');
      statTag.className = 'status-pill ' + (s.conf > 65 ? 'done' : 'wip');
      statTag.textContent = s.status;

      const now = new Date().toLocaleTimeString('ar-EG');
      document.getElementById('attendanceLogConsole').textContent = `[DETECT]: ${now} -> Target switched to ${s.name} (${s.conf.toFixed(1)}%)`;
    }

    function scanAndLogAttendance() {
      const s = SUBJECTS[currentSubjectIdx];
      const now = new Date().toLocaleTimeString('ar-EG');
      const logEl = document.getElementById('attendanceLogConsole');

      // Visual flash effect on camera
      const cam = document.getElementById('cameraViewport');
      cam.style.borderColor = '#10b981';
      setTimeout(() => { cam.style.borderColor = 'rgba(6, 182, 212, 0.4)'; }, 300);

      if (s.conf > 65) {
        logEl.textContent = `[SUCCESS]: ${now} -> تم تسجيل حضور "${s.name}" بنجاح في قاعدة بيانات SQLite (Match: ${s.conf.toFixed(1)}%).`;
        logEl.style.color = '#34d399';
      } else {
        logEl.textContent = `[ALERT]: ${now} -> تنبيه! شخص غير مصرح له أو نسبة التطابق منخفضة (${s.conf.toFixed(1)}%). تم رفض التسجيل.`;
        logEl.style.color = '#f87171';
      }
    }

    // ===== REAL ESTATE PREDICTOR DEMO LOGIC =====
    const DISTRICT_RATES = {
      'tagamoa': { name: 'التجمع الخامس / القاهرة الجديدة', baseRate: 29000 },
      'zayed': { name: 'الشيخ زايد / 6 أكتوبر', baseRate: 26500 },
      'maadi': { name: 'المعادي', baseRate: 23000 },
      'nasr': { name: 'مدينة نصر / مصر الجديدة', baseRate: 20500 },
      'downtown': { name: 'وسط البلد / الزمالك', baseRate: 34000 }
    };

    const FINISH_MULTS = {
      'super': { name: 'سوبر لوكس (Super Lux)', mult: 1.15 },
      'ultra': { name: 'ألترا لوكس فاخر (Ultra Lux)', mult: 1.30 },
      'core': { name: 'نصف تشطيب (Core & Shell)', mult: 1.00 }
    };

    function updateRePrice() {
      const distKey = document.getElementById('reDistrictSelect').value;
      const area = parseInt(document.getElementById('reAreaRange').value, 10);
      const rooms = parseInt(document.getElementById('reRoomsRange').value, 10);
      const finishKey = document.getElementById('reFinishSelect').value;

      const dist = DISTRICT_RATES[distKey];
      const finish = FINISH_MULTS[finishKey];

      document.getElementById('reDistrictVal').textContent = dist.name;
      document.getElementById('reAreaVal').textContent = area + ' م²';
      document.getElementById('reRoomsVal').textContent = rooms + (rooms === 1 ? ' غرفة' : ' غرف');
      document.getElementById('reFinishVal').textContent = finish.name;

      // Price calculation formula
      const baseMeterPrice = dist.baseRate * finish.mult;
      const roomBonus = (rooms - 1) * 35000;
      const totalPrice = Math.round((area * baseMeterPrice + roomBonus) / 1000) * 1000;
      const avgMeter = Math.round(totalPrice / area);

      document.getElementById('rePriceDisplay').textContent = totalPrice.toLocaleString('en-US') + ' ج.م';
      document.getElementById('rePerMeterDisplay').textContent = `متوسط سعر المتر: ${avgMeter.toLocaleString('en-US')} ج.م/م²`;
    }

    // ===== MEDICAL DIAGNOSIS DEMO LOGIC =====
    const MED_CASES = [
      {
        btnId: 'medBtn-0',
        tag: 'فحص سليم 100%',
        tagClass: 'done',
        title: 'الرئتان سليمتان تماماً (Clear Normal Lung Fields)',
        desc: 'لا توجد أي علامات ارتشاح أو بؤر صديدية أو كثافات غير طبيعية في الأنسجة الرئوية. الحجاب الحاجز والحدود القلبية في وضع طبيعي وصحي.',
        conf: 98.4,
        latency: '14ms Inference',
        graphic: '🩻',
        hasHeatmap: false
      },
      {
        btnId: 'medBtn-1',
        tag: 'اشتباه التهاب رئوي (Pneumonia)',
        tagClass: 'wip',
        title: 'ارتشاح رئوي في الفص الأيمن (Right Lobar Infiltration)',
        desc: 'اكتشف نموذج الـ CNN كثافة نسيجية متزايدة وارتشاحاً حاداً في الفص الأوسط والسفلي من الرئة اليمنى، مما يشير لاحتمالية عالية للإصابة بالتهاب رئوي بكتيري.',
        conf: 96.8,
        latency: '18ms Inference',
        graphic: '🩻',
        hasHeatmap: true
      },
      {
        btnId: 'medBtn-2',
        tag: 'اشتباه تليف وعقيدات (Nodules)',
        tagClass: 'wip',
        title: 'عقيدات رئوية دقيقة مع تكلس جزئي (Pulmonary Nodules)',
        desc: 'أظهر الفحص وجود عقيدة دائرية بأبعاد 8 مم في قمة الرئة اليسرى. يوصى بمتابعة دورية بواسطة الأشعة المقطعية عالية الدقة (HRCT) للتأكد من استقرار الحالة.',
        conf: 93.5,
        latency: '22ms Inference',
        graphic: '🩻',
        hasHeatmap: true
      }
    ];

    let currentMedScanIdx = 0;
    let heatmapVisible = false;

    function setMedScan(idx) {
      currentMedScanIdx = idx;
      const c = MED_CASES[idx];

      document.querySelectorAll('.med-sample-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });

      const tagEl = document.getElementById('medResultTag');
      tagEl.className = 'status-pill ' + c.tagClass;
      tagEl.textContent = c.tag;

      document.getElementById('medDiagnosisTitle').textContent = c.title;
      document.getElementById('medDiagnosisDesc').textContent = c.desc;
      document.getElementById('medConfidenceVal').textContent = c.conf.toFixed(1) + '%';
      document.getElementById('medConfidenceBar').style.width = c.conf + '%';
      document.getElementById('medLatency').textContent = c.latency;

      const hm = document.getElementById('xrayHeatmap');
      if (c.hasHeatmap && heatmapVisible) {
        hm.classList.add('show');
      } else {
        hm.classList.remove('show');
      }
    }

    function toggleHeatmap() {
      heatmapVisible = !heatmapVisible;
      const hm = document.getElementById('xrayHeatmap');
      if (heatmapVisible && MED_CASES[currentMedScanIdx].hasHeatmap) {
        hm.classList.add('show');
      } else {
        hm.classList.remove('show');
      }
    }

    // ===== ADDITIONAL PROJECT DEMOS =====
    const STORE_PRODUCTS = [
      { id: 'headphones', name: 'سماعة لاسلكية', category: 'electronics', categoryName: 'إلكترونيات', price: 1850, icon: '🎧' },
      { id: 'keyboard', name: 'لوحة مفاتيح ميكانيكية', category: 'electronics', categoryName: 'إلكترونيات', price: 2400, icon: '⌨️' },
      { id: 'watch', name: 'ساعة ذكية', category: 'accessories', categoryName: 'إكسسوارات', price: 3200, icon: '⌚' },
      { id: 'backpack', name: 'حقيبة يومية', category: 'accessories', categoryName: 'إكسسوارات', price: 850, icon: '🎒' },
      { id: 'lamp', name: 'مصباح مكتبي', category: 'home', categoryName: 'منزل', price: 620, icon: '💡' },
      { id: 'mug', name: 'كوب حراري', category: 'home', categoryName: 'منزل', price: 380, icon: '☕' }
    ];
    let storeCart = {};
    let todoItems = [];

    function setDemoStatus(id, message) {
      const element = document.getElementById(id);
      if (element) element.textContent = message;
    }

    function readDemoStorage(key, fallback, statusId) {
      try {
        const stored = localStorage.getItem(key);
        return stored === null ? fallback : JSON.parse(stored);
      } catch (error) {
        console.error(`Unable to read ${key} from local storage:`, error);
        setDemoStatus(statusId, 'تعذر قراءة البيانات المحفوظة من المتصفح.');
        return fallback;
      }
    }

    function saveDemoStorage(key, value, statusId) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Unable to save ${key} to local storage:`, error);
        setDemoStatus(statusId, 'تعذر حفظ البيانات. تحقق من إعدادات التخزين في المتصفح.');
        return false;
      }
    }

    function renderStore() {
      const category = document.getElementById('storeCategory').value;
      const maxPrice = Number(document.getElementById('storeMaxPrice').value);
      document.getElementById('storeMaxPriceLabel').textContent = maxPrice.toLocaleString('ar-EG');
      const products = STORE_PRODUCTS.filter(product =>
        (category === 'all' || product.category === category) && product.price <= maxPrice
      );
      const container = document.getElementById('storeProductsGrid');
      container.replaceChildren();

      products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'store-product';
        const icon = document.createElement('div');
        icon.className = 'store-product-icon';
        icon.textContent = product.icon;
        const name = document.createElement('h4');
        name.textContent = product.name;
        const categoryLabel = document.createElement('p');
        categoryLabel.textContent = product.categoryName;
        const price = document.createElement('div');
        price.className = 'store-product-price';
        price.textContent = `${product.price.toLocaleString('ar-EG')} ج.م`;
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'btn-action-primary';
        addButton.textContent = 'أضف للسلة';
        addButton.addEventListener('click', () => {
          storeCart[product.id] = (storeCart[product.id] || 0) + 1;
          const saved = saveDemoStorage('portfolio-demo-store-cart', storeCart, 'storeStatus');
          renderStoreCart();
          if (saved) setDemoStatus('storeStatus', 'تمت إضافة المنتج إلى السلة المحلية.');
        });
        card.append(icon, name, categoryLabel, price, addButton);
        container.appendChild(card);
      });
      if (products.length === 0) setDemoStatus('storeStatus', 'لا توجد منتجات مطابقة للفلاتر الحالية.');
    }

    function renderStoreCart() {
      const entries = Object.entries(storeCart)
        .filter(([id, quantity]) => STORE_PRODUCTS.some(product => product.id === id) && Number.isInteger(quantity) && quantity > 0);
      const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
      const total = entries.reduce((sum, [id, quantity]) => {
        const product = STORE_PRODUCTS.find(item => item.id === id);
        return sum + product.price * quantity;
      }, 0);
      document.getElementById('storeCartSummary').textContent =
        `السلة: ${itemCount.toLocaleString('ar-EG')} منتجات · ${total.toLocaleString('ar-EG')} ج.م`;
    }

    function renderTodos() {
      const container = document.getElementById('todoList');
      container.replaceChildren();
      todoItems.forEach(item => {
        const row = document.createElement('div');
        row.className = `todo-item${item.done ? ' done' : ''}`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.done;
        checkbox.setAttribute('aria-label', `تحديد إنجاز: ${item.title}`);
        checkbox.dataset.todoAction = 'toggle';
        checkbox.dataset.todoId = String(item.id);
        const title = document.createElement('span');
        title.className = 'todo-item-title';
        title.textContent = item.title;
        const priority = document.createElement('span');
        priority.className = 'todo-priority';
        priority.textContent = item.priority;
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.textContent = 'تعديل';
        edit.dataset.todoAction = 'edit';
        edit.dataset.todoId = String(item.id);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'حذف';
        remove.dataset.todoAction = 'delete';
        remove.dataset.todoId = String(item.id);
        row.append(checkbox, title, priority, edit, remove);
        container.appendChild(row);
      });
      document.getElementById('todoCount').textContent = `${todoItems.length.toLocaleString('ar-EG')} مهمة`;
      if (todoItems.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'extra-demo-status';
        empty.textContent = 'لا توجد مهام بعد. أضف أول مهمة من الحقل أعلاه.';
        container.appendChild(empty);
      }
    }

    function getWeatherDescription(code) {
      if (code === 0) return 'سماء صافية';
      if ([1, 2, 3].includes(code)) return 'غائم جزئيًا';
      if ([45, 48].includes(code)) return 'ضباب';
      if ([51, 53, 55, 56, 57].includes(code)) return 'رذاذ';
      if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'أمطار';
      if ([71, 73, 75, 77, 85, 86].includes(code)) return 'ثلوج';
      if ([95, 96, 99].includes(code)) return 'عواصف رعدية';
      return 'حالة جوية متغيرة';
    }

    async function searchWeather(city) {
      const button = document.getElementById('weatherSearchButton');
      const result = document.getElementById('weatherResult');
      button.disabled = true;
      result.hidden = true;
      setDemoStatus('weatherStatus', 'جارٍ البحث عن المدينة وتحميل بيانات الطقس...');
      try {
        const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
        geoUrl.search = new URLSearchParams({ name: city, count: '1', language: 'ar', format: 'json' });
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) throw new Error('تعذر الاتصال بخدمة البحث عن المدن.');
        const geoData = await geoResponse.json();
        const location = geoData.results && geoData.results[0];
        if (!location) {
          setDemoStatus('weatherStatus', 'لم نعثر على هذه المدينة. تحقق من الاسم وحاول مجددًا.');
          return;
        }

        const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
        forecastUrl.search = new URLSearchParams({
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min',
          timezone: 'auto',
          forecast_days: '5'
        });
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error('تعذر تحميل بيانات الطقس حاليًا.');
        const data = await forecastResponse.json();
        const current = data.current;
        result.replaceChildren();
        const summary = document.createElement('div');
        summary.className = 'weather-current';
        [
          [`${location.name}${location.country ? `، ${location.country}` : ''}`, getWeatherDescription(current.weather_code)],
          ['درجة الحرارة', `${Math.round(current.temperature_2m)}°م`],
          ['المحسوسة', `${Math.round(current.apparent_temperature)}°م`],
          ['الرطوبة', `${current.relative_humidity_2m}%`]
        ].forEach(([label, value]) => {
          const item = document.createElement('div');
          item.className = 'dashboard-stat';
          const name = document.createElement('span');
          name.textContent = label;
          const reading = document.createElement('strong');
          reading.textContent = value;
          item.append(name, reading);
          summary.appendChild(item);
        });
        result.appendChild(summary);
        const forecast = document.createElement('div');
        forecast.className = 'weather-current';
        data.daily.time.forEach((date, index) => {
          const day = document.createElement('div');
          day.className = 'weather-day';
          const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric' });
          day.append(document.createTextNode(dateLabel));
          const condition = document.createElement('strong');
          condition.textContent = getWeatherDescription(data.daily.weather_code[index]);
          const temperatures = document.createElement('div');
          temperatures.textContent = `${Math.round(data.daily.temperature_2m_min[index])}° / ${Math.round(data.daily.temperature_2m_max[index])}°`;
          day.append(condition, temperatures);
          forecast.appendChild(day);
        });
        result.appendChild(forecast);
        result.hidden = false;
        setDemoStatus('weatherStatus', 'بيانات الطقس مقدمة مباشرة من Open-Meteo.');
      } catch (error) {
        console.error('Weather lookup failed:', error);
        setDemoStatus('weatherStatus', error instanceof TypeError
          ? 'تعذر الاتصال بخدمة الطقس. تحقق من اتصال الإنترنت وحاول مجددًا.'
          : (error.message || 'حدث خطأ أثناء تحميل بيانات الطقس.'));
      } finally {
        button.disabled = false;
      }
    }

    const DASHBOARD_DATA = {
      month: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        visits: [42, 64, 51, 78, 60, 92],
        visitors: 1840, orders: 128, revenue: 24500
      },
      week: {
        labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        visits: [38, 66, 53, 82, 71, 95, 59],
        visitors: 426, orders: 31, revenue: 5820
      }
    };

    function renderDashboard(period) {
      const data = DASHBOARD_DATA[period];
      document.getElementById('dashboardVisitors').textContent = data.visitors.toLocaleString('ar-EG');
      document.getElementById('dashboardOrders').textContent = data.orders.toLocaleString('ar-EG');
      document.getElementById('dashboardRevenue').textContent = `${data.revenue.toLocaleString('ar-EG')} ج.م`;
      const chart = document.getElementById('dashboardChart');
      chart.replaceChildren();
      data.visits.forEach((value, index) => {
        const bar = document.createElement('button');
        bar.type = 'button';
        bar.className = 'dashboard-bar';
        bar.setAttribute('aria-label', `${data.labels[index]}: ${value} زيارة توضيحية`);
        const fill = document.createElement('span');
        fill.style.height = `${Math.max(10, Math.round(value / Math.max(...data.visits) * 145))}px`;
        const label = document.createElement('small');
        label.textContent = data.labels[index];
        bar.append(fill, label);
        bar.addEventListener('click', () => {
          chart.querySelectorAll('.dashboard-bar').forEach(item => item.classList.remove('active'));
          bar.classList.add('active');
          setDemoStatus('dashboardStatus', `${data.labels[index]}: ${value} زيارة توضيحية.`);
        });
        chart.appendChild(bar);
      });
    }

    function initializeExtraDemos() {
      const storedCart = readDemoStorage('portfolio-demo-store-cart', {}, 'storeStatus');
      if (storedCart && typeof storedCart === 'object' && !Array.isArray(storedCart)) {
        storeCart = Object.fromEntries(Object.entries(storedCart).filter(([id, count]) =>
          STORE_PRODUCTS.some(product => product.id === id) && Number.isInteger(count) && count > 0
        ));
      }
      const storedTodos = readDemoStorage('portfolio-demo-todos', [], 'todoStatus');
      if (Array.isArray(storedTodos)) {
        todoItems = storedTodos.filter(item => item && Number.isFinite(item.id) && typeof item.title === 'string')
          .map(item => ({ id: item.id, title: item.title, priority: ['عادية', 'مهمة', 'عاجلة'].includes(item.priority) ? item.priority : 'عادية', done: Boolean(item.done) }));
      }

      document.getElementById('storeCategory').addEventListener('change', renderStore);
      document.getElementById('storeMaxPrice').addEventListener('input', renderStore);
      document.getElementById('clearStoreCart').addEventListener('click', () => {
        storeCart = {};
        const saved = saveDemoStorage('portfolio-demo-store-cart', storeCart, 'storeStatus');
        renderStoreCart();
        if (saved) setDemoStatus('storeStatus', 'تم إفراغ السلة.');
      });
      renderStore();
      renderStoreCart();

      document.getElementById('todoForm').addEventListener('submit', event => {
        event.preventDefault();
        const titleInput = document.getElementById('todoTitle');
        const title = titleInput.value.trim();
        if (!title) return;
        todoItems.unshift({
          id: Date.now() + Math.random(),
          title,
          priority: document.getElementById('todoPriority').value,
          done: false
        });
        const saved = saveDemoStorage('portfolio-demo-todos', todoItems, 'todoStatus');
        renderTodos();
        titleInput.value = '';
        if (saved) setDemoStatus('todoStatus', 'تمت إضافة المهمة.');
        titleInput.focus();
      });
      document.getElementById('todoList').addEventListener('change', event => {
        const target = event.target;
        if (!target.matches('[data-todo-action="toggle"]')) return;
        const item = todoItems.find(todo => String(todo.id) === target.dataset.todoId);
        if (!item) return;
        item.done = target.checked;
        const saved = saveDemoStorage('portfolio-demo-todos', todoItems, 'todoStatus');
        renderTodos();
        if (saved) setDemoStatus('todoStatus', item.done ? 'تم تحديد المهمة كمكتملة.' : 'تمت إعادة فتح المهمة.');
      });
      document.getElementById('todoList').addEventListener('click', event => {
        const button = event.target.closest('[data-todo-action="edit"], [data-todo-action="delete"]');
        if (!button) return;
        const item = todoItems.find(todo => String(todo.id) === button.dataset.todoId);
        if (!item) return;
        if (button.dataset.todoAction === 'delete') {
          todoItems = todoItems.filter(todo => todo.id !== item.id);
          setDemoStatus('todoStatus', 'تم حذف المهمة.');
        } else {
          const editedTitle = window.prompt('اكتب نص المهمة الجديد:', item.title);
          if (editedTitle === null) return;
          if (!editedTitle.trim()) {
            setDemoStatus('todoStatus', 'لم يتم التعديل: نص المهمة لا يمكن أن يكون فارغًا.');
            return;
          }
          item.title = editedTitle.trim();
          setDemoStatus('todoStatus', 'تم تعديل المهمة.');
        }
        saveDemoStorage('portfolio-demo-todos', todoItems, 'todoStatus');
        renderTodos();
      });
      renderTodos();

      document.getElementById('weatherForm').addEventListener('submit', event => {
        event.preventDefault();
        const city = document.getElementById('weatherCity').value.trim();
        if (city) searchWeather(city);
      });
      document.getElementById('dashboardPeriod').addEventListener('change', event => renderDashboard(event.target.value));
      renderDashboard('month');
    }

    function copyActiveCode() {
      const code = PROJECTS_DATA[currentProjectIndex].code;
      navigator.clipboard.writeText(code).then(() => {
        alert('تم نسخ كود المشروع بنجاح إلى الحافظة!');
      });
    }

    // ===== INITIALIZE PAGE WITH URL PARAM / HASH =====
    window.addEventListener('DOMContentLoaded', () => {
      renderStudentsTable();
      initializeExtraDemos();

      const params = new URLSearchParams(window.location.search);
      let targetIndex = 0;

      if (params.has('id')) {
        const idVal = parseInt(params.get('id'), 10);
        if (!isNaN(idVal) && idVal >= 0 && idVal < PROJECTS_DATA.length) {
          targetIndex = idVal;
        }
      } else if (window.location.hash) {
        const match = window.location.hash.match(/\d+/);
        if (match) {
          const hashVal = parseInt(match[0], 10);
          if (hashVal >= 0 && hashVal < PROJECTS_DATA.length) targetIndex = hashVal;
        }
      }

      renderProject(targetIndex);
    });
