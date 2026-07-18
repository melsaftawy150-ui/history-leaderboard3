// الرابط الصحيح والمباشر الخاص بك
const API_URL = "https://script.google.com/macros/s/AKfycbw08fnZ46M8kck6Cq07oVZc65cpxChNvAntrrla_Cm76I_5VlIpcGLRdRg3UJXAX1-j/exec";

async function loadData() {
    try {
        const response = await fetch(API_URL, { method: "GET", redirect: "follow" });
        let data = await response.json();

        // التأكد من تحويل الدرجات لأرقام لترتيبها بشكل حسابي صحيح (الأعلى أولاً)
        data.sort((a, b) => {
            let scoreA = Object.values(a)[2] || Object.values(a)[1] || 0;
            let scoreB = Object.values(b)[2] || Object.values(b)[1] || 0;
            return Number(scoreB) - Number(scoreA);
        });

        // استثناء: جعل الطالبة Janah Amr في بداية القائمة دائماً بناءً على رغبتك
        data.sort((a, b) => {
            let nameA = (Object.values(a)[0] || "").toString().trim().toLowerCase();
            let nameB = (Object.values(b)[0] || "").toString().trim().toLowerCase();
            if (nameA === "janah amr") return -1;
            if (nameB === "janah amr") return 1;
            return 0;
        });

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        // مصفوفة نظيفة لحفظ الطلاب المرتبين
        let formattedStudents = data.map((item, index) => {
            // قراءة القيم بشكل مرن مهما كان ترتيب الأعمدة في الشيت
            let values = Object.values(item);
            return {
                rank: index + 1,
                name: values[0] || "بدون اسم",
                score: values[1] || values[2] || 0
            };
        });

        // عرض جدول الطلاب بالكامل
        formattedStudents.forEach((student) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.rank}</td>
                    <td>${student.name}</td>
                    <td>${student.score}</td>
                </tr>
            `;
        });

        // ربط منصة التتويج (الأول والثاني والثالث) بالأسماء والدرجات الحقيقية
        if (formattedStudents.length >= 1) {
            document.getElementById("firstName").textContent = formattedStudents[0].name;
            document.getElementById("firstScore").textContent = formattedStudents[0].score + " درجة";
        }
        if (formattedStudents.length >= 2) {
            document.getElementById("secondName").textContent = formattedStudents[1].name;
            document.getElementById("secondScore").textContent = formattedStudents[1].score + " درجة";
        }
        if (formattedStudents.length >= 3) {
            document.getElementById("thirdName").textContent = formattedStudents[2].name;
            document.getElementById("thirdScore").textContent = formattedStudents[2].score + " درجة";
        }

    } catch (error) {
        console.error("خطأ في قراءة البيانات:", error);
    }
}

// كود البحث الذكي
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// تشغيل جلب البيانات فوراً
loadData();
// تحديث كل 30 ثانية
setInterval(loadData, 30000);
