export default function PeopleCam(name, image) {
    const peopleCam = document.createElement('div');
    peopleCam.className = 'people-cam';

    const camImg = document.createElement('img');
    camImg.className = 'cam-img';
    camImg.src = image;
    camImg.alt = name + '의 카메라 화면';
    camImg.width = 150;
    camImg.height = 80;

    const camName = document.createElement('div');
    camName.className = 'cam-name';
    camName.textContent = name;
    peopleCam.appendChild(camImg);
    peopleCam.appendChild(camName);

    return peopleCam;
}
