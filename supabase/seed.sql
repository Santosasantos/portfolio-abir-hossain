-- =====================================================================
-- Seed: Abir Hasan's portfolio content (safe to re-run: clears content tables first)
-- =====================================================================
begin;

truncate public.header_items, public.social_links, public.hero_buttons, public.hero_stats,
  public.tags, public.featured_items, public.education, public.focus_points, public.test_scores,
  public.skill_groups, public.publications, public.research_areas, public.experiences,
  public.projects, public.honors, public.certifications, public.tools;
delete from public.sections;
delete from public.site_settings;

insert into public.site_settings (
  id, full_name, headline, bio, interests_line, photo_url, cv_url,
  status_enabled, status_label, status_title, status_body, background,
  scholar_url, scholar_citations, scholar_h_index,
  contact_intro, contact_note, footer_blurb, last_updated, meta_title, meta_description
) values (
  1,
  'Abir Hasan',
  'Researcher in Medical Imaging & Computer Vision · B.Sc. in Computer Science & Engineering',
  'I build deep learning systems that read medical images — fine-tuning CNNs and transfer-learning models to classify brain tumors from MRI, with a growing focus on making those models explainable enough to trust in the clinic.',
  'Computer Vision · Medical Imaging · Transfer Learning · Explainable AI · Biomedicine',
  'https://avatars.githubusercontent.com/u/55851577?v=4',
  '/Abir_Hasan_CV.pdf',
  true,
  'Open to opportunities',
  'Prospective PhD student, Fall 2027',
  'Seeking labs working on AI for biomedicine, medical image analysis, and explainable deep learning.',
  E'I am a Computer Science & Engineering graduate of Rajshahi University of Engineering & Technology with a strong foundation in mathematics and a lasting curiosity about how machine learning can change biomedicine. My undergraduate research on automated brain tumor classification from MRI produced two papers at IEEE ICCIT 2023, comparing fine-tuned transfer-learning models against a purpose-built, compute-efficient CNN.\n\nSince graduating I have worked remotely as an AI tutor and expert annotator with Mindrift and as a freelance AI trainer with Outlier, evaluating model reasoning, writing supervised fine-tuning data, and building preference datasets that improve factual accuracy and safety. That work keeps me close to how large models are trained, evaluated, and aligned.\n\nOutside research I have led hackathon and programming-contest teams, organized science festivals, and volunteered in blood drives. I plan to begin a PhD in Fall 2027 focused on AI for biomedicine, and I am keen to connect with researchers and mentors working on medical imaging and explainable deep learning.',
  'https://scholar.google.com/citations?user=bIbOv6sAAAAJ&hl=en', 4, 2,
  'I am applying for PhD positions starting Fall 2027 and welcome conversations about medical image analysis, explainable deep learning, and AI for biomedicine.',
  'Based in Rajshahi, Bangladesh · References available on request',
  'Deep learning for medical imaging, transfer learning, and explainable AI in biomedicine.',
  '2026-10-12',
  'Abir Hasan | Researcher in Medical Imaging & Computer Vision',
  'Abir Hasan — CSE graduate from RUET and IEEE-published researcher in medical image analysis, transfer learning, and explainable AI. Prospective PhD student, Fall 2027.'
);

insert into public.sections (key, nav_label, title, subtitle, sort_order) values
  ('about',        'About',        'About',                 'Research background and academic profile', 1),
  ('publications', 'Publications', 'Publications',          'Peer-reviewed research in medical image analysis and deep learning', 2),
  ('research',     'Research',     'Research Areas',        'Where my current work sits, and where I want to take it during a PhD', 3),
  ('experience',   'Experience',   'Experience',            'Research and professional work', 4),
  ('projects',     'Projects',     'Projects',              'Research software, systems, and selected engineering projects', 5),
  ('tools',        'Tools & Demos', 'Research Software, Tools & Interactive Demos', 'Kaggle notebooks, datasets, and from-scratch implementations of classic learning algorithms', 6),
  ('honors',       'Honors',       'Honors & Achievements', 'Awards, leadership, certifications, and community', 7),
  ('contact',      'Contact',      'Get In Touch',          'Interested in research collaboration, PhD supervision, or academic inquiries?', 8);

insert into public.header_items (icon, label, url, in_hero, in_contact, sort_order) values
  ('building', 'Rajshahi University of Engineering & Technology (RUET)', 'https://www.ruet.ac.bd', true, false, 1),
  ('pin',      'Rajshahi, Bangladesh', 'https://maps.google.com/?q=Rajshahi,Bangladesh', true, false, 2),
  ('mail',     'abirhasan1998@gmail.com', 'mailto:abirhasan1998@gmail.com', true, true, 3),
  ('phone',    '+880 1812 375570', 'tel:+8801812375570', false, true, 4);

insert into public.social_links (icon, label, url, in_hero, in_contact, in_footer, sort_order) values
  ('scholar',      'Google Scholar', 'https://scholar.google.com/citations?user=bIbOv6sAAAAJ&hl=en', true, false, true, 1),
  ('github',       'GitHub',         'https://github.com/Bosshero476', true, false, true, 2),
  ('linkedin',     'LinkedIn',       'https://www.linkedin.com/in/abir-hasan-5a2bb9166/', true, true, true, 3),
  ('kaggle',       'Kaggle',         'https://www.kaggle.com/abirhasan1703100', true, false, true, 4),
  ('researchgate', 'ResearchGate',   'https://www.researchgate.net/profile/Abir-Hasan-27', true, true, true, 5),
  ('globe',        'Google Site',    'https://sites.google.com/view/abirhasan1998', false, false, true, 6),
  ('mail',         'Email',          'mailto:abirhasan1998@gmail.com', true, false, false, 7);

insert into public.hero_buttons (label, url, icon, variant, is_download, sort_order) values
  ('Google Scholar', 'https://scholar.google.com/citations?user=bIbOv6sAAAAJ&hl=en', null, 'primary', false, 1),
  ('Publications',   '#publications', null, 'outline', false, 2),
  ('GitHub',         'https://github.com/Bosshero476', null, 'outline', false, 3),
  ('Download CV',    '{cv}', 'download', 'outline', true, 4),
  ('Contact',        '#contact', null, 'outline', false, 5);

insert into public.hero_stats (value, suffix, label, sort_order) values
  ('2', null, 'IEEE papers', 1),
  ('99.16', '%', 'Best accuracy', 2);

insert into public.tags (grp, label, emphasis, sort_order) values
  ('interest', 'Computer Vision', true, 1),
  ('interest', 'Medical Imaging', true, 2),
  ('interest', 'Deep Learning & Neural Networks', true, 3),
  ('interest', 'Transfer Learning', true, 4),
  ('interest', 'Explainable AI', true, 5),
  ('interest', 'Biomedicine', true, 6),
  ('interest', 'Machine Learning', true, 7),
  ('interest', 'Bioinformatics', false, 8),
  ('community', 'Kaggle Discussions Legacy Expert', true, 1),
  ('community', 'Kaggle top 15% contributor', true, 2),
  ('community', 'Codeforces', false, 3),
  ('community', 'ACM ICPC 2018 participant', false, 4),
  ('community', 'Blood-drive volunteer', false, 5),
  ('community', 'Science festival organizer', false, 6);

-- The MIST paper entry is a placeholder until Abir sends the paper details: update it in Admin → Featured work.
insert into public.featured_items (title, summary, date_label, links, sort_order) values
  ('New Paper at a MIST Conference',
   'My most recent paper, from a conference hosted by the Military Institute of Science and Technology (MIST), Dhaka. Title, abstract, and links will be added here shortly.',
   null,
   '[]', 1),
  ('Transfer Learning for Brain Tumor MRI (ICCIT 2023)',
   'Six fine-tuned pretrained CNNs compared for four-class tumor classification; EfficientNetB0 and InceptionResNetV2 lead.',
   'Dec 2023',
   '[{"label": "Paper", "url": "https://doi.org/10.1109/ICCIT60459.2023.10441355"}, {"label": "Slides", "url": "https://drive.google.com/file/d/1gojRcSDqiMcAuSyV_lFVMwg4XKU7r8ez/view?usp=sharing"}, {"label": "Code", "url": "https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images"}]', 2),
  ('Optimized Custom CNN (ICCIT 2023)',
   'A lightweight five-block CNN tuned across four optimizers that rivals pretrained models at a fraction of the compute.',
   'Dec 2023',
   '[{"label": "Paper", "url": "https://doi.org/10.1109/ICCIT60459.2023.10441068"}, {"label": "Slides", "url": "https://drive.google.com/file/d/16leAy_GxXiufNI6mo5MJDRVgXwKbmtSG/view?usp=sharing"}, {"label": "Code", "url": "https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images"}]', 3),
  ('Explainable CAD for Kidney CT (In Preparation)',
   'A hyperparameter-tuned CNN for four-class CT kidney image categorization (cyst, tumor, stone, normal), benchmarked against Swin Transformer, ViT, and EfficientNetB7.',
   'Ongoing',
   '[{"label": "Details", "url": "#pub-kidney"}]', 4),
  ('Undergraduate Thesis, RUET',
   'Custom CNNs, fine-tuned transfer learning, and a model-averaging ensemble for multi-class brain tumor classification on two MRI datasets.',
   '2023',
   '[{"label": "Project", "url": "#projects"}, {"label": "Code", "url": "https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images"}]', 5),
  ('National Hackathon 2020 — Winner (Group 7)',
   'Team RUET ABACUS built an AI-driven occupational health & safety system under the IDEA project.',
   '2020',
   '[{"label": "Certificate", "url": "https://drive.google.com/file/d/13M4XUj-8PMvsntC73Q7cJZMZxAeusS1c/view?usp=sharing"}, {"label": "Honors", "url": "#honors"}]', 6);

insert into public.education (degree, institution, period, details, note, sort_order) values
  ('B.Sc. in Computer Science & Engineering', 'Rajshahi University of Engineering & Technology (RUET)',
   '2018 – 2023', 'CGPA 3.23 / 4.00 · Merit Scholarship 2018–2022',
   'Thesis: Enhanced Multi-Class Brain Tumor Classification for MRI Images Using Fine-tuned Deep Learning Approaches — supervised by Rizoan Toufiq', 1),
  ('Higher Secondary Certificate (Science)', 'Adamjee Cantonment College, Dhaka',
   '2017', 'Academic Excellence & Best Student Performance Award', null, 2);

insert into public.focus_points (label, sort_order) values
  ('Medical image analysis — brain tumor classification from MRI', 1),
  ('Transfer learning and fine-tuning of pretrained CNNs for small clinical datasets', 2),
  ('Custom CNN design and hyperparameter optimization', 3),
  ('Ensemble learning for robust diagnostic models', 4),
  ('Explainable AI for trustworthy biomedical decision support', 5),
  ('Bioinformatics and machine learning in biomedicine', 6);

insert into public.test_scores (value, label, note, sort_order) values
  ('306', 'GRE total', 'Oct 29, 2025', 1),
  ('167', 'GRE Quant', 'AWA 3.5', 2),
  ('7.0', 'IELTS overall', 'Sep 22, 2026 · C1', 3),
  ('8.0', 'IELTS reading', 'L 7.5 · W 6.5 · S 6.5', 4);

insert into public.skill_groups (title, items, highlighted, sort_order) values
  ('Programming languages', '{Python,C,C++,SQL,Assembly,Verilog}', '{Python}', 1),
  ('ML frameworks & libraries', '{TensorFlow,Keras,Scikit-learn,OpenCV,NumPy,Pandas,Matplotlib}', '{TensorFlow,Keras,Scikit-learn,OpenCV}', 2),
  ('Hardware & simulation', '{"Arduino Uno","L298N motor driver","TCRT5000 sensors",Logisim,Multisim}', '{}', 3),
  ('Tools & writing', '{Git,Jupyter,Kaggle,MATLAB,"VS Code","LaTeX / Overleaf","MS Office"}', '{}', 4);

insert into public.publications (
  category, anchor, venue_badge, status, date_label, title, authors, highlight_author, venue,
  abstract, keywords, metrics, links, bibtex, presentation_note, code_url, media, is_visible, sort_order
) values
(
  'conference', 'pub-transfer', 'IEEE ICCIT 2023', 'Published', 'Dec 2023',
  'Automated Multi-Class Brain Tumor Classification for MRI Image Using Transfer Learning',
  'A. Hasan, R. Toufiq, and M. Z. Islam', 'A. Hasan',
  '2023 26th International Conference on Computer and Information Technology (ICCIT), Cox''s Bazar, Bangladesh, pp. 910–915',
  'Training a CNN from scratch is hard when medical imaging datasets are small, so this work fine-tunes six pretrained models — VGG16, ResNet-50, ResNet-101, Inception-ResNet-v2, Xception, and EfficientNetB0 — to classify glioma, meningioma, pituitary tumor, and non-tumor brain MRI. Models were evaluated on a 3,264-image dataset and on a 7,022-image combined MRI, CE-MRI, and Br35H dataset, with data augmentation to curb overfitting. EfficientNetB0 is proposed as the best overall model, reaching up to 96.33% accuracy on Dataset I, while Inception-ResNet-v2 achieved the top accuracy of up to 99.16% on Dataset II.',
  '{"Brain Tumor","Deep Learning","Transfer Learning",EfficientNetB0,"Magnetic Resonance Imaging"}',
  '[{"value":"99.16%","label":"InceptionResNetV2 · Dataset II"},{"value":"96.33%","label":"EfficientNetB0 · Dataset I"},{"value":"7,022","label":"MRI images (combined set)"}]',
  '[{"label": "IEEE Xplore", "url": "https://ieeexplore.ieee.org/document/10441355"}, {"label": "DOI", "url": "https://doi.org/10.1109/ICCIT60459.2023.10441355"}]',
  E'@inproceedings{hasan2023transfer,\n  author    = {Hasan, Abir and Toufiq, Rizoan and Islam, Md. Zahirul},\n  title     = {Automated Multi-Class Brain Tumor Classification for MRI Image Using Transfer Learning},\n  booktitle = {2023 26th International Conference on Computer and Information Technology (ICCIT)},\n  address   = {Cox''s Bazar, Bangladesh},\n  pages     = {910--915},\n  year      = {2023},\n  doi       = {10.1109/ICCIT60459.2023.10441355}\n}',
  'Presented at IEEE ICCIT 2023, Cox''s Bazar, Bangladesh', 'https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images',
  '[{"kind": "image", "url": "/media/pub-transfer-mri-samples.webp", "caption": "Sample MRI from each class (Dataset I): glioma, no tumor, meningioma, pituitary", "role": "figure"}, {"kind": "image", "url": "/media/pub-transfer-confusion-matrix.webp", "caption": "EfficientNetB0 confusion matrix on the Dataset I test split", "role": "figure"}, {"kind": "pdf", "url": "https://drive.google.com/file/d/1gojRcSDqiMcAuSyV_lFVMwg4XKU7r8ez/view?usp=sharing", "caption": "ICCIT 2023 presentation slides", "role": "presentation", "name": "298 Presentation_slide.pdf"}]', true, 1
),
(
  'conference', 'pub-cnn', 'IEEE ICCIT 2023', 'Published', 'Dec 2023',
  'Optimized Convolutional Neural Network with Hyperparameter Tuning for Multi-Class Brain Tumor Classification',
  'A. Hasan, R. Toufiq, and M. Z. Islam', 'A. Hasan',
  '2023 26th International Conference on Computer and Information Technology (ICCIT), Cox''s Bazar, Bangladesh, pp. 1793–1798',
  'This paper designs and tunes a custom CNN — five convolution and max-pooling blocks followed by four fully connected layers — for four-class brain tumor classification. Three architecture scenarios were trained with Adam, Adamax, SGD, and Adagrad. With ReLU and softmax activations and the Adamax optimizer, the model reached up to 96.02% accuracy on a 3,264-image dataset (F1 95.75%) and up to 98.58% on a 7,022-image combined dataset (F1 98.75%), outperforming established pretrained models while needing far less compute.',
  '{"Brain Tumor","Deep Learning","Convolutional Neural Network","Magnetic Resonance Imaging","Computer-Aided Diagnosis"}',
  '[{"value":"98.58%","label":"Accuracy · Dataset II"},{"value":"96.02%","label":"Accuracy · Dataset I"},{"value":"Adamax","label":"Best of 4 optimizers"}]',
  '[{"label": "IEEE Xplore", "url": "https://ieeexplore.ieee.org/document/10441068"}, {"label": "DOI", "url": "https://doi.org/10.1109/ICCIT60459.2023.10441068"}]',
  E'@inproceedings{hasan2023optimized,\n  author    = {Hasan, Abir and Toufiq, Rizoan and Islam, Md. Zahirul},\n  title     = {Optimized Convolutional Neural Network with Hyperparameter Tuning for Multi-Class Brain Tumor Classification},\n  booktitle = {2023 26th International Conference on Computer and Information Technology (ICCIT)},\n  address   = {Cox''s Bazar, Bangladesh},\n  pages     = {1793--1798},\n  year      = {2023},\n  doi       = {10.1109/ICCIT60459.2023.10441068}\n}',
  'Presented at IEEE ICCIT 2023, Cox''s Bazar, Bangladesh', 'https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images',
  '[{"kind": "image", "url": "/media/pub-cnn-architecture.webp", "caption": "Custom CNN architecture: Conv2D, max-pooling and dropout blocks feeding dense layers", "role": "figure"}, {"kind": "image", "url": "/media/pub-cnn-roc.webp", "caption": "Per-class ROC curves on Dataset II (AUC 0.99–1.00)", "role": "figure"}, {"kind": "pdf", "url": "https://drive.google.com/file/d/16leAy_GxXiufNI6mo5MJDRVgXwKbmtSG/view?usp=sharing", "caption": "ICCIT 2023 presentation slides", "role": "presentation", "name": "575_presentation_slide.pdf"}]', true, 2
),
(
  'preprint', 'pub-kidney', 'Journal Manuscript', 'In preparation', 'Ongoing',
  'Explainable Hyperparameter-Tuned Neural Network-Based CAD System for Multi-Class CT Kidney Image Categorization',
  'A. Hasan et al.', 'A. Hasan', null,
  'This ongoing study builds a computer-aided diagnosis system that categorizes CT kidney images into four classes (cyst, tumor, stone, and normal) using a custom convolutional neural network whose hyperparameters are tuned for the task. Trained and evaluated on 11,756 CT images, the model reaches 99.49% accuracy with an AUC of 1.00 and is compared against Swin Transformer, Vision Transformer, and EfficientNetB7 baselines. The manuscript is being refined for journal submission.',
  '{"CT Kidney","Computer-Aided Diagnosis","Explainable AI","Hyperparameter Tuning","Vision Transformer"}',
  '[{"value":"99.49%","label":"Accuracy"},{"value":"1.00","label":"AUC"},{"value":"11,756","label":"CT images · 4 classes"}]',
  '[]', null, null, null, '[]', true, 3
),
(
  'conference', 'pub-mist', 'MIST Conference', 'Presented', null,
  '[Placeholder] MIST conference paper title',
  'A. Hasan, co-authors', 'A. Hasan', 'Conference name, Military Institute of Science and Technology (MIST), Dhaka, Bangladesh',
  'PLACEHOLDER (hidden): fill in the MIST conference paper details from Abir, then tick Visible. Keep the same anchor so the Featured Work link can point to #pub-mist.',
  '{}', '[]', '[]', null, null, null, '[]', false, 4
);

insert into public.research_areas (icon, title, description, sort_order) values
  ('brain',  'Medical Image Analysis', 'Automated classification of brain tumors — glioma, meningioma, pituitary, and normal — from MRI, CE-MRI, and Br35H scans; robust preprocessing and augmentation for small clinical datasets.', 1),
  ('layers', 'Transfer Learning & Efficient CNNs', 'Fine-tuning ImageNet backbones (EfficientNet, ResNet, Inception-ResNet, Xception, VGG), designing lightweight custom CNNs, optimizer studies, and model-averaging ensembles.', 2),
  ('eye',    'Explainable & Trustworthy AI', 'Making diagnostic models interpretable — saliency and attribution methods, error analysis, and evaluation practices that help clinicians understand and trust model predictions.', 3),
  ('dna',    'Bioinformatics & ML for Biomedicine', 'Applying machine learning to biological and healthcare data, and data-quality practices from large-model training — annotation, evaluation, and supervised fine-tuning datasets.', 4);

insert into public.experiences (grp, period, title, org, bullets, sort_order) values
  ('professional', '2024 – Present', 'AI Tutor — Expert Annotator', 'Mindrift · Werftestrasse 4, Switzerland (Remote)',
   '{"Evaluate, refine, and annotate model outputs for reasoning, programming, and NLP tasks to improve AI alignment.","Create high-quality supervised fine-tuning datasets that improve factual correctness, safety, and model generalization."}', 1),
  ('professional', 'May 2024 – Dec 2024', 'Freelance AI Trainer', 'Outlier · Oakland, USA (Remote)',
   '{"Produced instruction-tuning and preference-ranking datasets to improve model consistency and reasoning ability.","Contributed to scalable data pipelines used for model training, evaluation, and alignment optimization."}', 2),
  ('academic', '2022 – 2023', 'Undergraduate Researcher', 'Dept. of CSE, Rajshahi University of Engineering & Technology · Supervisor: Rizoan Toufiq',
   '{"Proposed three custom CNN models and an ensemble that averages fine-tuned pretrained models for multi-class brain tumor classification.","Benchmarked six transfer-learning backbones on two brain MRI datasets; results published as two IEEE ICCIT 2023 papers."}', 3);

insert into public.projects (featured, badge, year_label, icon, title, description, tags, links, pipeline, media, sort_order) values
  (true, 'Featured · Undergraduate Thesis', '2023', 'brain', 'Automated Multi-Class Brain Tumor Classification Using MRI',
   'Custom convolutional networks, fine-tuned transfer learning, and an ensemble approach that averages predictions from the strongest pretrained models — achieving top accuracy on two brain MRI datasets. Supervised by Rizoan Toufiq, Dept. of CSE, RUET.',
   '{"TensorFlow","Keras","Transfer Learning","Ensembles"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/Undergraduate-Thesis-Multi-Class-Brain-Tumor-Classification-Using-MRI-Images"}, {"label": "Related papers", "url": "#publications"}]',
   '[{"title": "Data", "text": "3,264 + 7,022 MRI images, 4 classes"}, {"title": "Preprocess", "text": "resize, normalize, augment"}, {"title": "Models", "text": "3 custom CNNs + 6 fine-tuned backbones"}, {"title": "Ensemble", "text": "model-averaging of top performers"}, {"title": "Result", "text": "up to 99.16% accuracy"}]',
   '[{"kind": "image", "url": "/media/pub-transfer-mri-samples.webp", "caption": "One MRI per class from Dataset I", "role": "figure"}, {"kind": "image", "url": "/media/project-thesis-training-curves.webp", "caption": "EfficientNetB0 training and validation accuracy / loss", "role": "figure"}]', 1),
  (false, null, '2023', 'lock', 'Network Security: DES Encryption',
   'A complete DES encryption and decryption workflow with security utilities, demonstrating secure data handling with classic block-cipher techniques (CSE 4215 project).',
   '{"Python","Cryptography","Jupyter"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/Network-Security-DES-Encryption-and-Security-Utilities"}]',
   '[]',
   '[]', 2),
  (false, null, '2022', 'pin', 'COVID Person Tracking System',
   'An Android app that flags suspected COVID cases through a questionnaire, tracks their location for admin monitoring, clears records after a negative test, and issues vaccination reports — with real-time chat support (CSE 3200 project).',
   '{"Android","Java","Firebase"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/covid-person-tracking"}, {"label": "Video demo", "url": "https://www.youtube.com/watch?v=ThZImS_Oglo"}, {"label": "Proposal", "url": "https://drive.google.com/file/d/1Z1UihqREQdqOKIaiiaPqfeHHDFsdnXiy/view?usp=sharing"}]',
   '[]',
   '[{"kind": "video", "url": "https://www.youtube.com/watch?v=ThZImS_Oglo", "caption": "COVID Person Tracking — app walkthrough", "role": "presentation"}]', 3),
  (false, null, '2022', 'cpu', '6-Bit CPU Design',
   'A custom 6-bit CPU with a 3-bit opcode ISA, XOR/NOT ALU, three registers, 7-word RAM, and register, immediate and branching (JLE) modes — full ISA, ROM mapping, and a Logisim circuit of control logic and memory.',
   '{"Logisim","Computer Architecture"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/6-bit-CPU-DESIGN"}, {"label": "ISA & ROM (PDF)", "url": "https://github.com/Bosshero476/6-bit-CPU-DESIGN/blob/main/ISA-Design%20%26%20ROM%20Module%20(1703100).pdf"}]',
   '[]',
   '[{"kind": "image", "url": "/media/project-6bit-cpu.webp", "caption": "Logisim circuit of the 6-bit CPU", "role": "thumbnail"}]', 4),
  (false, null, '2021', 'building', 'Smart Library Management System',
   'A PHP/MySQL web platform with separate librarian, student and faculty logins that automated book tracking and cut manual workload by 60%, with optimized queries and an admin dashboard (CSE 3100 project).',
   '{"PHP","MySQL","Web"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/smart-library"}, {"label": "Proposal", "url": "https://drive.google.com/file/d/1hIuzRfDxazfeBSH8RcDuNb0MDxpqCqIC/view?usp=sharing"}]',
   '[]',
   '[]', 5),
  (false, null, 'Hardware', 'cpu', 'Line Follower Robot',
   'An Arduino Uno robot using an L298N motor driver and TCRT5000 infrared sensors to follow a track autonomously; a dummy circuit limits current for smoother movement (CSE 3208 project).',
   '{"C++","Arduino","Embedded"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/Line-Follower-Robot-with-Arduino-Uno"}]',
   '[]',
   '[{"kind": "image", "url": "/media/project-line-follower.webp", "caption": "The assembled line follower robot", "role": "thumbnail"}]', 6),
  (false, null, 'Coursework', 'layers', 'Database Systems',
   'Relational database design work from the RUET sessional course — schema modelling, normalization, and SQL.',
   '{"SQL","Database Design"}',
   '[{"label": "GitHub", "url": "https://github.com/Bosshero476/Sessional_Database_Systems"}]',
   '[]',
   '[]', 7);

insert into public.honors (grp, year_label, title, subtitle, url, sort_order) values
  ('award', '2025', 'Top 20, Graduation Round', 'National Green Energy Olympiad 2025 (GEO 2025)', 'https://drive.google.com/file/d/17MGb8wWFti9_K-JyH7gZDotvWDiuIuup/view?usp=sharing', 1),
  ('award', '2021', 'Rajshahi Region Top 10', '12th National Undergraduate Math Olympiad', 'https://drive.google.com/file/d/1TXBrpbSPFW8jawZuAVsPBHOVI6YWybsb/view?usp=sharing', 2),
  ('award', '2020', 'Winner, National Hackathon 2020 (Group 7)', 'Team RUET ABACUS — AI-driven occupational health & safety system, IDEA project', 'https://drive.google.com/file/d/13M4XUj-8PMvsntC73Q7cJZMZxAeusS1c/view?usp=sharing', 3),
  ('award', '2018–22', 'Merit Scholarship', 'Rajshahi University of Engineering & Technology', null, 4),
  ('award', '2017', 'Academic Excellence & Best Student Performance', 'Adamjee Cantonment College', 'https://drive.google.com/file/d/1KcBhv8SjHDkCiF0gEBnJ15jv6J3V7DjN/view?usp=sharing', 5),
  ('award', '2016', '1st Prize, Project Display (IT Senior)', '2nd ACC National Science Festival — "Calculator Game"', 'https://drive.google.com/file/d/1clSC4xxQrVbRmcL_7AZGul-t3cHYldOh/view?usp=sharing', 6),
  ('award', '2015', '1st Position, Chemistry Olympiad', 'ACC Science Festival, Neutrino ACC Science Club', 'https://drive.google.com/file/d/1KlWUF43zd0Ae_Bj0CYC67taB-1XmwdjV/view?usp=sharing', 7),
  ('award', '2011', '1st, General Knowledge Quiz Competition', 'Monipur High School & College', null, 8),
  ('leadership', '2020', 'Team Coordinator', 'National Hackathon 2020', null, 1),
  ('leadership', '2018–19', 'Team Leader', 'Codesmash 2018 and Gyanjam 2019 programming competitions', null, 2),
  ('leadership', '2016–17', 'Prefect & Class Captain', 'Adamjee Cantonment College', null, 3),
  ('leadership', null, 'Research Mentor', 'Mentored juniors on deep learning and computer vision research', null, 4);

insert into public.certifications (title, issuer, date_label, url, sort_order) values
  ('Introduction to Python', 'Kaggle', 'Apr 2023', null, 1),
  ('Networking Devices and Initial Configuration', 'Cisco', 'Mar 2023', null, 2),
  ('Python Essentials 1', 'Cisco', 'Feb 2023', null, 3),
  ('Networking Basics', 'Cisco', 'Feb 2023', null, 4),
  ('Introduction to Cybersecurity', 'Cisco', 'Feb 2023', null, 5),
  ('Cybersecurity Pathway', 'Cisco', 'Feb 2023', null, 6);

insert into public.tools (icon, title, description, features, tags, links, sort_order) values
  ('chart', 'Hopfield Neural Network',
   'A Kaggle notebook implementing the Hopfield network, the classic recurrent associative-memory model.',
   '{"Implementation notebook on Kaggle","Associative memory with a recurrent network","Runs in the browser on Kaggle"}', '{"Python","Neural Networks"}',
   '[{"label": "View notebook", "url": "https://www.kaggle.com/code/abirhasan1703100/hopfield-neural-networks-algorithm"}]', 1),
  ('layers', 'Single-Layer Perceptron',
   'A Kaggle notebook implementing the single-layer perceptron learning algorithm, paired with a small dataset built for it.',
   '{"Implementation notebook on Kaggle","Companion dataset published separately","Runs in the browser on Kaggle"}', '{"Python","Perceptron"}',
   '[{"label": "View notebook", "url": "https://www.kaggle.com/code/abirhasan1703100/implementation-single-layer-perceptron-algorithm"}, {"label": "Dataset", "url": "https://www.kaggle.com/datasets/abirhasan1703100/single-layer-perceptron-datasetsmall"}]', 2),
  ('eye', 'KNN on the Iris Dataset',
   'A Kaggle notebook applying k-nearest neighbours to the Iris flower dataset.',
   '{"Implementation notebook on Kaggle","Classic Iris classification task","Runs in the browser on Kaggle"}', '{"Python","KNN","Classification"}',
   '[{"label": "View notebook", "url": "https://www.kaggle.com/code/abirhasan1703100/knn-implementation-on-iris-dataset/notebook"}]', 3);

commit;
