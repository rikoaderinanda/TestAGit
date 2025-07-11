

$(document).ready(function() {
	var user = localStorage.getItem('user');
	const btnTambahPlan = document.getElementById('btnTambahPlan');
	if (!user) {
		$('#userSelectModal').modal('show');
		if(btnTambahPlan!=null){
			btnTambahPlan.style.display = 'none'; // Sembunyikan tombol tambah plan untuk Bos
		}
		
	}
	else {
		$('#txtUserSelected').text(user);
		const targetRow = document.getElementById('menuContainer'); // pastikan ada elemen ini
		
		targetRow.innerHTML = '';
		if(user === 'Asep') {
			const homeMenu = generateMenuItem('bi bi-house', 'Plan', 'Home', 'Index', true);
			const layananMenu = generateMenuItem('bi bi-gear', 'Processed', 'Home', 'Processing');
			const profileMenu = generateMenuItem('bi bi-person', 'Finished', 'Home', 'Finished');
			targetRow.appendChild(homeMenu);
			targetRow.appendChild(layananMenu);
			targetRow.appendChild(profileMenu);
			if(btnTambahPlan!=null){
			btnTambahPlan.style.display = 'block'; // Tampilkan tombol tambah plan
			}
		}
		else if(user === 'Bos') {
			const homeMenu = generateMenuItem('bi bi-house', 'Aproval', 'Home', 'Index', true);
			const profileMenu = generateMenuItem('bi bi-person', 'Finished', 'Home', 'Finished');
			targetRow.appendChild(homeMenu);
			
			targetRow.appendChild(profileMenu);
			if(btnTambahPlan!=null){
			btnTambahPlan.style.display = 'none'; // Sembunyikan tombol tambah plan untuk Bos
			}
		}
	}

	$('#btnAsep').click(function() {
		localStorage.setItem('user', 'Asep');
		$('#userSelectModal').modal('hide');
		location.reload();
	});
	$('#btnBos').click(function() {
		localStorage.setItem('user', 'Bos');
		$('#userSelectModal').modal('hide');
		location.reload();
	});	
	$('#planDateFrom').change(function() {
		checkTanggalInput();
	});
	$('#planDateTo').change(function() {
		checkTanggalInput();
	});

	$('#ModalPlan').on('show.bs.modal', function (event) {
		const button = $(event.relatedTarget); // Tombol yang memicu modal
		const action = button.data('action'); // Ambil data-action dari tombol
		const modal = $(this);
		if (action === 'new') {
			modal.find('.modal-title').text('Tambah Plan Baru');
			modal.find('#planDateFrom').val(''); // Kosongkan input tanggal
			modal.find('#planDateTo').val(''); // Kosongkan input tanggal
			modal.find('#jumlahUnitContainer').addClass('d-none'); // Sembunyikan jumlah unit
			modal.find('#alertHari').addClass('d-none'); // Sembunyikan alert hari
			checkTanggalInput();
		} else {
			modal.find('.modal-title').text('Edit Plan');
			const IdLog = button.data('id'); // Ambil data-id dari tombol
			GetPlanningById(IdLog)
		}
	});
	$('#btnValidateForm').click(function() {
		validateForm(1);
	});
	$('#btnSimpanDuluForm').click(function() {
		validateForm(0);
	});
	
});

function Logout() {
	localStorage.removeItem('user');
	location.reload();
}

function generateMenuItem(iconClass, label, controller, action, isSelected = false) {
	const col = document.createElement('div');
	col.className = isSelected ? 'col selected' : 'col';

	const a = document.createElement('a');
	a.href = `/${controller}/${action}`;
	a.className = 'small text-decoration-none position-relative';

	const p = document.createElement('p');
	p.className = 'h4 m-0';
	p.innerHTML = `<i class="${iconClass}"></i>`;

	const span = document.createElement('span');
	span.innerText = label;

	a.appendChild(p);
	a.appendChild(span);
	col.appendChild(a);

	return col;
}

function checkTanggalInput() {
	const dateFrom = document.getElementById('planDateFrom').value;
	const dateTo = document.getElementById('planDateTo').value;
	const alertHari = document.getElementById('alertHari');	
	const jumlahUnitContainer = document.getElementById('jumlahUnitContainer');

	if (dateFrom === '' && dateTo === '') {
		alertHari.classList.remove('d-none');
		alertHari.textContent = 'Silahkan set tanggal Awal dan Akhir';
		jumlahUnitContainer.classList.add('d-none');
	}
	else {
		alertHari.classList.add('d-none');
		alertHari.textContent = '';
		const dateObjFrom = new Date(dateFrom);
		const dateObjTo = new Date(dateTo);
		const diffTime = Math.abs(dateObjTo - dateObjFrom);
		//const timeDiff = dateTo.getTime() - dateFrom.getTime(); // dalam milidetik
    	const daysDiff = Math.ceil(diffTime / (1000 * 3600 * 24)); // konversi ke hari
    	console.log("Durasi:", daysDiff, "hari");

		const options = { weekday: 'long' }; 
		const hariFrom = dateObjFrom.toLocaleDateString('id-ID', options);
		const hariTo = dateObjTo.toLocaleDateString('id-ID', options);
		console.log(`Hari Awal: ${hariFrom}, Hari Akhir: ${hariTo},Selisih: ${diffTime}`);

		if (hariFrom !== 'Senin') {
			alertHari.classList.remove('d-none');
			alertHari.textContent = 'Tanggal Awal mesti hari Senin';
			document.getElementById('planDateFrom').value = '';
			jumlahUnitContainer.classList.add('d-none');
			return; // Keluar dari fungsi jika hari awal tidak valid

		}
		if (hariTo !== 'Minggu') {
			alertHari.classList.remove('d-none');
			alertHari.textContent = 'Tanggal Akhir mesti hari Minggu';
			document.getElementById('planDateTo').value = '';
			jumlahUnitContainer.classList.add('d-none');
			return; // Keluar dari fungsi jika hari awal tidak valid
		}	
		if (dateObjTo < dateObjFrom) {	
			alertHari.classList.remove('d-none');
			alertHari.textContent = 'Tanggal Akhir mesti lebih besar dari Tanggal Awal';
			document.getElementById('planDateTo').value = '';
			jumlahUnitContainer.classList.add('d-none');
			return; // Keluar dari fungsi jika hari awal tidak valid
		}	

		if(daysDiff > 7) {
			alertHari.classList.remove('d-none');
			alertHari.textContent = 'Durasi tidak boleh lebih dari 7 hari';
			document.getElementById('planDateTo').value = '';
			jumlahUnitContainer.classList.add('d-none');
			return; // Keluar dari fungsi jika durasi tidak valid
		}
		
		alertHari.classList.add('d-none');		
		alertHari.textContent = '';
		jumlahUnitContainer.classList.remove('d-none');
	
	}	
}

function adjustValue(day, adjustment) {
	const input = document.getElementById(`input-${day}`);
	if (input) {
		let currentValue = parseInt(input.value) || 0; // Ambil nilai saat ini atau 0 jika kosong
		currentValue += adjustment; // Tambah atau kurangi sesuai dengan adjustment
		if (currentValue < 0) currentValue = 0; // Pastikan tidak negatif
		input.value = currentValue; // Set nilai baru ke input
	}
}

function validateForm(status) {
	const data = {
		id:parseInt($('#txtId').val()) || 0,
		dateFrom: $('#planDateFrom').val(),
		dateTo: $('#planDateTo').val(),
		createBy:localStorage.getItem('user')|| "",
		senin: parseInt($('#input-Senin').val()) || 0,
		selasa: parseInt($('#input-Selasa').val()) || 0,
		rabu: parseInt($('#input-Rabu').val()) || 0,
		kamis: parseInt($('#input-Kamis').val()) || 0,
		jumat: parseInt($('#input-Jumat').val()) || 0,
		sabtu: parseInt($('#input-Sabtu').val()) || 0,
		minggu: parseInt($('#input-Minggu').val()) || 0,
		status:status
	};

	// Validasi
	if (!data.dateFrom || !data.dateTo) {
		alert("Tanggal harus diisi.");
		return;
	}
	console.log(JSON.stringify(data));
	var urlact = "";
	if($('#txtId').val()==""){
		urlact = '/api/Planning/CreateNewPlan';
	}
	else{
		urlact = '/api/Planning/UpdatePlan';
	}
	$.ajax({
		url: urlact,
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function (response) {
			console.log('Response:', response);
			alert('Berhasil menyimpan rencana!');
			$('#ModalPlan').modal('hide');
			GetPlanning(0); // refresh daftar planning
		},
		error: function (xhr, status, error) {
			console.error('Gagal:', error);
			alert('Gagal menyimpan data.');
		}
	});

}

function GetPlanning(filterValue) {
	var user = localStorage.getItem('user');
	$.getJSON('/api/Planning/GetPlan/'+filterValue, function (data) {
		SkeletonLoadingListPlan();
		var html = $.map(data, function (item) {
			var status = item.status;
			var scr = "";
			if(user =="Asep"){
				scr = 
				`
					<div class="card mb-3 position-relative shadow-sm border-0">
						<div class="card-body">
							<p class="card-text mb-2">
								ID Plan : <span class="fw-semibold text-success">${item.Id}</span>
								<br>
								Periode : <span class="fw-semibold text-black">
												${formatTanggalIndo(item.StartDate)} s/d ${formatTanggalIndo(item.LastDate)}
								</span>
							</p>
							<div class="mt-0">
								<div class="table-responsive" style="overflow-x: auto;">
									<table class="table table-border mb-0" style="white-space: nowrap;">
										<tbody style="text-align:center;">
											<tr>
												<td>Senin</td>
												<td>Selasa</td>
												<td>Rabu</td>
												<td>Kamis</td>
												<td>Jumat</td>
												<td>Sabtu</td>
												<td>Minggu</td>
												<td>Total</td>
											</tr>
											<tr>
												<td>${item.Senin}</td>
												<td>${item.Selasa}</td>
												<td>${item.Rabu}</td>
												<td>${item.Kamis}</td>
												<td>${item.Jumat}</td>
												<td>${item.Sabtu}</td>
												<td>${item.Minggu}</td>
												<td>
												${
													item.Senin+
													item.Selasa+
													item.Rabu+
													item.Kamis+
													item.Jumat+
													item.Sabtu+
													item.Minggu
												}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<p>diajukan oleh : ${item.CreateBy}</p>`;
				if(status == 0) 
				{
					scr = scr +
							`<a href="#ModalPlan" 
								data-bs-toggle="modal" 
								data-action="edit"
								data-id="${item.Id}"
								class="btn btn-outline-primary btn-sm"
								title="Lihat Detail Status"
								style="position: absolute; right: 10px; top:10px; 
										border-radius: 50%; width: 28px; 
										height: 28px; display: flex; align-items: center; justify-content: center;">
							
								<i class="bi bi-pencil" style="font-size: 0.8rem;"></i>
							</a>`;
				}
				scr = scr +
						`</div>
						</div>
						`;
			}
			else{
				scr = 
			`
				<div class="card mb-3 position-relative shadow-sm border-0">
					<div class="card-body">
						<p class="card-text mb-2">
							ID Plan : <span class="fw-semibold text-success">${item.Id}</span>
							<br>
							Periode : <span class="fw-semibold text-black">
											${formatTanggalIndo(item.StartDate)} s/d ${formatTanggalIndo(item.LastDate)}
							</span>
						</p>
						<div class="mt-0">
							<div class="table-responsive" style="overflow-x: auto;">
								<table class="table table-border mb-0" style="white-space: nowrap;">
									<tbody style="text-align:center;">
										<tr>
											<td>Senin</td>
											<td>Selasa</td>
											<td>Rabu</td>
											<td>Kamis</td>
											<td>Jumat</td>
											<td>Sabtu</td>
											<td>Minggu</td>
											<td>Total</td>
										</tr>
										<tr>
											<td>${item.Senin}</td>
											<td>${item.Selasa}</td>
											<td>${item.Rabu}</td>
											<td>${item.Kamis}</td>
											<td>${item.Jumat}</td>
											<td>${item.Sabtu}</td>
											<td>${item.Minggu}</td>
											<td>
											${
												item.Senin+
												item.Selasa+
												item.Rabu+
												item.Kamis+
												item.Jumat+
												item.Sabtu+
												item.Minggu
											}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<p>diajukan oleh : ${item.CreateBy}</p>`;
				
				if(status == 1) 
				{
					scr = scr +
					`<div style="position: absolute; right: 10px; bottom: 10px; display: flex; gap: 8px;">
						<button id="btnTolak"
							class="btn btn-outline-danger btn-sm"
							title="Tolak"
							onclick="TolakPlan(${item.Id})"
							style="border-radius: 8px; padding: 4px 10px;">
							Tolak
						</button>
						<button id="btnSetuju"
							class="btn btn-outline-success btn-sm"
							title="Setuju"
							onclick="SetujuPlan(${item.Id})"
							style="border-radius: 8px; padding: 4px 10px;">
							Setuju
						</button>
					</div>`;
				}
				
				scr = scr +		
					`</div>
						</div>
					`;
			}
			
			return scr;
		}).join('');
	
		$('#ListPlaning').html(html);
		lazyAnimateItems("ListPlaning");
	});
}

function SkeletonLoadingListPlan() {
	var scr = `
		<div class="card mb-3 position-relative shadow-sm border-0">
			<div class="card-body">
				<div class="skeleton-loading">
					<div class="skeleton-text"></div>
					<div class="skeleton-text"></div>
					<div class="skeleton-text"></div>
				</div>
			</div>
		</div>
	`;
	$('#ListPlaning').html(scr);
}

function GetPlanningById(Id) {
	$.getJSON('/api/Planning/GetPlanById/' + Id, function (data) {
		$.map(data, function (item) {
			$('#txtIdLog').text('ID Plan : ' + item.Id); // Tampilkan ID di dalam modal
			$('#txtId').val(item.Id);
			$('#txtUser').val(item.CreateBy);
			
			const startDate = item.StartDate.split('T')[0];
			const LastDate = item.LastDate.split('T')[0];
			$('#planDateFrom').val(startDate);
			$('#planDateTo').val(LastDate);
			
			checkTanggalInput();
			const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

			days.forEach(day => {
				const value = item[day] ?? 0;
				$('#input-' + day).val(value);
			});
			console.log(user);
			if(user =="Asep"){
				$('#frmPlan').find('input').prop('disabled', false);
			}
			else
			{
				$('#frmPlan').find('input').prop('disabled', true);
				$('#frmPlan').find('input, select, textarea, button').prop('disabled', true);
			}
		});
	});
}

function TolakPlan(Id){
	$.ajax({
		url: '/api/Planning/Declined/'+Id,
		type: 'POST',
		contentType: 'application/json',
		data: null,
		success: function (response) {
			console.log('Response:', response);
			alert('Berhasil tolak planning!');
			GetPlanning(1); // refresh daftar planning
		},
		error: function (xhr, status, error) {
			console.error('Gagal:', error);
			alert('Gagal menyimpan data.');
		}
	});
}

function SetujuPlan(Id){
	$.ajax({
		url: '/api/Planning/Approval/'+Id,
		type: 'POST',
		contentType: 'application/json',
		data: null,
		success: function (response) {
			console.log('Response:', response);
			alert('Berhasil menyetujui Planning!');
			GetPlanning(1); // refresh daftar planning
		},
		error: function (xhr, status, error) {
			console.error('Gagal:', error);
			alert('Gagal menyimpan data.');
		}
	});
}