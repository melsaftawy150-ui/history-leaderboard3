// الرابط الصحيح والنهائي الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbyTGWbMNgZ5BslCRV-viQ89fen9Gj6AKKF4a9lqcV_MuIN9QrEO-TlSC0BqEHK6uprz/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        const data = await response.json();

        const tableBody = document.getElementById("tableBody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        // تحويل البيانات بشكل آمن بناءً على ترتيب الأعمدة (العمود 1: الاسم، العمود 2: الدرجة)
        let formattedStudents = data.map((item) => {
            let values = Object.values(item); 
            // values[0] هو الاسم، values[1] أو values[2] هي الدرجة حسب ترتيب الشيت
            let name = values[0] || "بدون اسم";
            let score = values[1] !== undefined && !isNaN(values[1]) ? Number(values[1]) : (Number(values[2]) || 0);
            
            return { name: name.toString().trim(), score: score };
        });

        // 1. ترتيب بقية الطلاب من الأعلى للأقل في الدرجات
        formattedStudents.sort((a, b) => b.score - a.score);

        // 2. استثناء: جعل الطالبة Janah Amr في بداية القائمة دائماً بناءً على طلبك
        formattedStudents.sort((a, b) => {
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            if (nameA === "janah amr" || nameA.includes("جنا عمرو")) return -1;
            if (nameB === "janah amr" || nameB.includes("جنا عمرو")) return 1;
            return 0;
        });

        // عرض البيانات في الجدول وضبط الرقم التسلسلي (الترتيب)
        formattedStudents.forEach((student, index) => {
            let rank = index + 1;
            tableBody.innerHTML += `
                <tr>
                    <td>${rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // تحديث منصة التتويج الثلاثية بالدرجات الحقيقية
        if (formattedStudents.length >= 1) {
            if(document.getElementById("firstName")) document.getElementById("firstName").textContent = formattedStudents[0].name;
            if(document.getElementById("firstScore")) document.getElementById("firstScore").textContent = formattedStudents[0].score + " درجة";
        }
        if (formattedStudents.length >= 2) {
            if(document.getElementById("secondName")) document.getElementById("secondName").textContent = formattedStudents[1].name;
            if(document.getElementById("secondScore")) document.getElementById("secondScore").textContent = formattedStudents[1].score + " درجة";
        }
        if (formattedStudents.length >= 3) {
            if(document.getElementById("thirdName")) document.getElementById("thirdName").textContent = formattedStudents[2].name;
            if(document.getElementById("thirdScore")) document.getElementById("thirdScore").textContent = formattedStudents[2].score + " درجة";
        }

    } catch (error) {
        console.error("خطأ في جلب أو معالجة البيانات:", error);
    }
}

// كود البحث الذكي
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll("#tableBody tr").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    });
}

// تشغيل الدالة فوراً والتحديث التلقائي
loadData();
setInterval(loadData, 30000);
